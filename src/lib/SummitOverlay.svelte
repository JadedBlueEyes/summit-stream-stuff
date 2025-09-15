<script lang="ts">
  export let itineryContent: string = "Now / Next";
  export let bannerText: string = "WIKI.MUSICBRAINZ.ORG/IRC";
  export let summitSubheading: string = "SUMMIT 2025";
  import navbarLogo from '../assets/metabrainz_compact_wordmark.svg';
  import smiley from '../assets/smiley.svg'
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
    <div class="content-box" contenteditable spellcheck="false">
      {itineryContent}
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
    clip-path: polygon(0 0, calc(100% - 1em) 0%, 100% 100%, 0% 100%); /* Angled top-right corner */
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
    clip-path: polygon(0 0, 92.5% 0, 100% 100%, 0% 100%); /* Angled right side */
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
    min-height: 10px;
    color: #333;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
</style>
