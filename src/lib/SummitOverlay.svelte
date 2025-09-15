<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Repo } from '@automerge/automerge-repo';
  import { BrowserWebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket';
  import { init } from '@automerge/prosemirror';
  import { EditorState } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { keymap } from 'prosemirror-keymap';
  import { baseKeymap } from 'prosemirror-commands';
  import { history, undo, redo } from 'prosemirror-history';

  export let bannerText: string = "WIKI.MUSICBRAINZ.ORG/IRC";
  export let summitSubheading: string = "SUMMIT 2025";

  import navbarLogo from '../assets/metabrainz_compact_wordmark.svg';
  import smiley from '../assets/smiley.svg';

  // Document structure for collaborative editing
  interface SummitDocument {
    itineraryContent: string;
  }

  // Component state
  let editorElement: HTMLDivElement;
  let editorView: EditorView | null = null;
  let repo: Repo | null = null;
  let docHandle: any = null;
  let isInitialized = false;

  async function createIndexedDBStorage() {
    try {
      const { IndexedDBStorageAdapter } = await import('@automerge/automerge-repo-storage-indexeddb');
      return new IndexedDBStorageAdapter();
    } catch (error) {
      console.warn('Failed to load IndexedDB storage, using memory storage:', error);
      return undefined;
    }
  }

  async function initializeRepo() {
    try {
      // Create Automerge repo with WebSocket networking
      repo = new Repo({
        network: [
          new BrowserWebSocketClientAdapter('wss://sync.automerge.org')
        ],
        // Enable persistence in browser storage
        storage: typeof window !== 'undefined' ?
          await createIndexedDBStorage() :
          undefined
      });

      return repo;
    } catch (error) {
      console.error('Failed to initialize repo:', error);
      return null;
    }
  }

  async function createDocument() {
    if (!repo) return null;

    try {
      // Create new document
      const handle = repo.create<SummitDocument>({
        itineraryContent: "Now / Next"
      });

      console.log('Created new document:', handle.url);
      console.log('Share this URL for collaboration:', handle.url);

      return handle;
    } catch (error) {
      console.error('Error creating document:', error);
      return null;
    }
  }

  async function initializeProseMirror() {
    if (!docHandle || !editorElement || isInitialized) return;

    try {
      // Wait for document to be ready
      await docHandle.whenReady();

      // Initialize ProseMirror with Automerge integration
      const { schema, pmDoc, plugin } = init(docHandle, ["itineraryContent"]);

      // Create editor state with collaborative features
      const state = EditorState.create({
        schema,
        doc: pmDoc,
        plugins: [
          keymap({
            ...baseKeymap,
            "Mod-z": undo,
            "Mod-y": redo,
            "Mod-Shift-z": redo,
            // "Enter": () => false, // disable newline
          }),
          history(),
          plugin, // Automerge sync plugin
        ]
      });

      // Create the editor view
      editorView = new EditorView(editorElement, {
        state,
        dispatchTransaction(transaction) {
          const newState = editorView!.state.apply(transaction);
          editorView!.updateState(newState);
        }
      });

      isInitialized = true;
      console.log('ProseMirror initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ProseMirror:', error);
    }
  }


  onMount(async () => {
    try {
      // Initialize the Automerge repo with WebSocket networking
      repo = await initializeRepo();
      if (!repo) {
        return;
      }

      // Create the collaborative document
      docHandle = await createDocument();
      if (!docHandle) {
        return;
      }

      // Try to initialize ProseMirror, fallback to simple editor if it fails
      try {
        await initializeProseMirror();
      } catch (error) {
        console.warn('ProseMirror initialization failed: ', error);

      }
    } catch (error) {
      console.error('Failed to initialize collaborative editing:', error);
    }
  });

  onDestroy(() => {
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }
    if (repo) {
      repo.shutdown();
      repo = null;
    }
    isInitialized = false;
  });
</script>

<div class="widget-container">
  <div class="top-section">
    <div class="top-bar">
      <div class="logo-container">
        <img class="logo-img" src={navbarLogo} alt="MetaBrainz Logo">
      </div>
      <div class="summit-box">
        <span>{summitSubheading}</span>
      </div>
    </div>
    <div
      bind:this={editorElement}
      class="content-box"
    >
    </div>
  </div>

  <div class="bottom-section">
    <div class="bottom-bar">
      <img class="bottom-icon" src={smiley} alt="Smiley Face">
      <span>{bannerText}</span>
    </div>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

  .widget-container {
    width: 450px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    padding: 20px
  }

  .top-bar {
    background-color: #2a3a31;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    clip-path: polygon(0 0, calc(100% - 1em) 0%, 100% 100%, 0% 100%);
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-img {
    height: 32px;
    width: auto;
  }

  .summit-box {
    background-color: #5ba856;
    color: #2a3a31;
    padding: 4px 16px 4px 12px;
    font-weight: 700;
    font-size: 1.1rem;
    margin-left: 12px;
    clip-path: polygon(0 0, 92.5% 0, 100% 100%, 0% 100%);
  }

  .bottom-bar {
    background-color: #5ba856;
    color: #2a3a31;
    padding: 8px 12px 8px 40px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    position: relative;
    margin-left: 24px;
  }

  .bottom-icon {
    width: 48px;
    height: 48px;
    position: absolute;
    left: -24px;
    top: 50%;
    transform: translateY(-50%) scale(125%);
  }

  .content-box {
    background-color: white;
    border: 3px solid #2a3a31;
    min-height: 18px;
    color: #333;
    padding: 8px 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    /*line-height: 1.3;*/
    outline: none;
    position: relative;
  }

  .content-box:focus {
    outline: 2px solid #5ba856;
    outline-offset: 2px;
  }

  :global(.content-box .ProseMirror) {
    outline: none !important;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
  }

  :global(.content-box .ProseMirror p) {
    margin: 0;
    padding: 0;
  }


  /* Loading state */
  .content-box:not(:focus):empty::before {
    content: "Initializing collaborative editor...";
    color: #999;
    font-style: italic;
  }

  /* Collaborative cursor styles */
  :global(.content-box .collaboration-cursor) {
    border-left: 2px solid #5ba856;
    position: relative;
  }

  :global(.content-box .collaboration-selection) {
    background-color: rgba(91, 168, 86, 0.2);
  }
</style>
