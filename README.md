# github-include

A web component/JavaScript to turn github repo links into cards with links to github pages and show the latest commits.

## Usage

1. Include [the script](github-include.js) in your page
1. If you want to style the results yourself, use the HTML version:
    ```HTML
    <div class="github-include"  data-commits="5" data-pages="🌍" data-links="true">
    <a href="https://github.com/codepo8/mastodon-share">
        Mastodon Share
    </a>
    </div>
    ```
1. If you want to use the default style including dark/light mode, use the web component
    ```HTML
    <github-include commits="5" pages="🌍" links="true">
        <a href="https://github.com/codepo8/mastodon-share">Mastodon Share</a>
    </github-include>
    ```

## Settings

You can customise the functionality using attributes on the component or data-attributes on the HTML:

<dl>
    <dt>commits</dt>
    <dd>Show the last x commits to the repository, f.e. `5`, set to `-1` to show all.</dd>
    <dt>links</dt>
    <dd>If set to `true`, the commit messages will be links to the commits.</dd>
    <dt>pages</dt>
    <dd>If set to a certain text, it will create a link to the GitHub Pages of the project with the text you provide</dd>
    <dt>commitheader</dt>
    <dd>Text to show before the commit messages - preset is `Latest commits:`</dd>
    <dt>loadingmessage</dt>
    <dd>Text to show whilst loading commit messages - preset is `loading…`</dd>
</dl>

## Demo

[You can see < github-include /> in action here](https://codepo8.github.io/github-include/)


