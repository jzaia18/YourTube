# YourTube

A browser extension that rewrites parts of the YouTube UI, each change individually configurable by the user.

## Language

### Settings

**Feature**:
One user-visible change YourTube makes to YouTube, paired with its own setting that can turn it off.
_Avoid_: Mod, tweak, rewrite

**Master switch**:
The single setting that turns every feature off at once, showing plain YouTube.
_Avoid_: Global toggle, kill switch

### Logo link

**Logo link**:
The feature that changes where the YouTube logo leads.
_Avoid_: Logo redirect, home button reroute

**Logo destination**:
The page the YouTube logo leads to: Homepage, Subscriptions, Watch later, or Custom (a user-entered path on youtube.com). Homepage is YouTube's own behaviour.
_Avoid_: Logo target, home page setting

### Guide

**Guide**:
YouTube's full navigation menu, opened with the ☰ button beside the logo: Home, Subscriptions, You, Explore, More from YouTube, Settings, and more. Docked on the left on most desktop pages, it slides out as a drawer on the watch page. The narrow rail of icons shown when the Guide is collapsed is not the Guide, nor is the column of recommended videos beside the player. YouTube's mobile site has no Guide. Say "Guide" internally; where users read it, say "Sidebar (Guide)", since most people call it the sidebar.
_Avoid_: Sidebar (on its own), menu, left nav

**Explore section**:
The section of the Guide headed "Explore", linking to YouTube's topic pages such as Music, Gaming, News, and Sports.
_Avoid_: Explore menu, Explore tab

**More from YouTube section**:
The section of the Guide headed "More from YouTube", linking to YouTube's other products such as YouTube Premium, YouTube TV, YouTube Music, and YouTube Kids.
_Avoid_: Other products, YouTube apps

### Watch page

**Watch page**:
The YouTube page that plays a single video (youtube.com/watch), with the video's title, buttons, description, and comments below the player. Shorts are not watch pages.
_Avoid_: Video page, player page

**Ask button**:
YouTube's button for asking its AI about the video being watched, labelled "Ask". It sits with the buttons below the player and among the fullscreen player's quick actions.
_Avoid_: Ask AI button, Gemini button

**Store shelf**:
The row of products a channel sells, which YouTube shows below the video on a watch page. YouTube labels it with the channel's store name. Only YouTube's desktop site shows it.
_Avoid_: Purchase section, merch shelf, product shelf

### Shorts

**Short**:
A video YouTube opens in its Shorts player (youtube.com/shorts/…) rather than on a watch page. A vertical video that opens on a watch page is not a Short.
_Avoid_: Reel, short video

**Shorts shelf**:
A horizontal row of Shorts that YouTube inserts into a feed, separate from its regular videos.
_Avoid_: Shorts carousel, Shorts row

**Subscriptions page**:
The feed of recent uploads from the channels the user subscribes to (youtube.com/feed/subscriptions). Logged out, it shows only a sign-in prompt.
_Avoid_: Subscriptions feed, subs page
