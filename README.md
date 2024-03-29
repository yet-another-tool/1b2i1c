<div align="center">

<img src="./docs/logo.png" alt="Project Logo" width="256">

<h2>1 Button 2 Inputs 1 Configuration</h2>

<p>A simple and configurable UI to Start and Update CodePipeline and/or Github Actions.</p>
<p>This application uses a simple configuration file in JSON, it gives you control of your pipelines and show statuses, general information and more !</p>

<p align="center">
  <a href="https://github.com/yet-another-tool/1b2i1c/issues">Report Bug</a>
  ·
  <a href="https://github.com/yet-another-tool/1b2i1c/issues">Request Feature</a>
</p>
</div>

---

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#changelog">Changelog</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About

- Supports **Github Actions** through _Workflow Dispatch_ (`workflow_dispatch`)
- Supports **AWS CodePipeline** using _AWS SDK v3_
- Uses a JSON format to configure your pipelines
- Uses your credentials to interact with pipelines
- Let you deploy specific branch
- Provide an easy way to share pipeline configurations to different team
- Give more control to developers and avoid the hassle to go in the Github or AWS UI
- Quickly deploy a branch to a specific environment
- See what is where with two clicks

---

## Installation

**Prerequisites:**

Go to https://tauri.app/v1/guides/getting-started/prerequisites to install **Rust**

**_Then you can start the project locally:_**

```bash
npm install

npm run tauri dev
```

**_To build the application and share it:_**

```bash
npm run tauri build
# OR to build MacOS universal
rustup target add x86_64-apple-darwin
npx tauri build --target universal-apple-darwin
```

You can also get the latest build in the **releases** section.

Enjoy !

---

## Usage

1. Create your configuration

```bash
nano ~/onebtwoionec.config.json
```

```json
{
  "authentication": {
    "github": {
      "api_key": "YOUR_PERSONAL_GITHUB_API_KEY"
    }
  },
  "pipelines": [
    {
      "friendlyName": "AWS ra-demo-repo-private",
      "pipeline": "test",
      "profile": "deployment",
      "region": "ca-central-1",
      "codePipelineActionName": "Source",
      "type": "codepipeline"
    },
    {
      "friendlyName": "GH ra-demo-repo-private",
      "workflow_id": "backend.yml",
      "repository": "ra-demo-repo-private",
      "owner": "yet-another-tool",
      "inputs": {},
      "type": "github"
    }
  ]
}
```

2. Then setup your **AWS credentials** as usual (I only tested the assume role using IAM user and role).

   > Required only if you are using AWS CodePipeline

3. When using **Github Actions**, you MUST provide the **branch name** manually (_aka `ref`_)

4. Finally open the application.

<div align="center">
<img src="./docs/v1.2.0.png" alt="Application V1.2.0" width="333">
</div>

**Github Action Example** with the `workflow_dispatch` approach: [backend.yml](./docs/backend.yml)

---

### Github Actions permissions

```text
Full Control: Repo
Workflow
```

---

## Changelog

### Todo

- [] Autofill branch name in the pipeline.
- [] Real time and notification events.

### V1.5.2 - Rollback

- Rollback github octokit CDN

<details>
  <summary>### V1.5.1 - Third Party dependency issue</summary>

- Fixed github octokit CDN
</details>

<details>
  <summary>### V1.5.0 - Added more details for github actions workflows - 2023-05-05</summary>

- Added github workflow information
- Added github inputs

<div align="center">
<img src="./docs/v150.png" alt="Github Information" width="333">
</div>
</details>
<details>
  <summary>### V1.4.2 - Moved code to Vuex (#12) - 2023-01-15</summary>

- Implemented Vuex
- Split into smaller components
- Implemented views
- Code Cleanup
</details>

<details>
  <summary>### V1.4.1 - Improved UX and Flow for the detect changes toggle (#14) - 2023-01-15</summary>

- Moved the detect changes logic, isolated it to update the pipeline only

<div align="center">
<img src="./docs/v141.png" alt="Detect Changes UX" width="333">
</div>
</details>

<details>
  <summary>### V1.4.0 - Added new Features (#7 and #8) - 2023-01-08</summary>

- The Commit ID is clickable (Only github is supported for now.)
- You can toggle the "Detect Changes" for codepipeline directly
- You can fetch and see all the details about the pipeline

<div align="center">
<img src="./docs/v140-commit-link.png" alt="CodePipeline Commit Link Clickable" width="333">
<img src="./docs/v140-detect-changes.png" alt="CodePipeline Detect Changes" width="333">
<img src="./docs/v140-info.png" alt="CodePipeline Get More Information about pipeline" width="333">
</div>

</details>

<details>
  <summary>### V1.3.0 - Improved Error/Success for the CodePipeline Source Action - 2023-01-04</summary>

- This way it can guide you and avoid using the AWS UI and see quickly what is wrong with the source.
<div align="center">
<img src="./docs/errorHandling.png" alt="CodePipeline Source Error Handling" width="333">
<img src="./docs/success.png" alt="CodePipeline Source Success" width="333">
</div>

</details>

<details>
  <summary>### V1.2.0 - Added Github Actions - 2022-10-05</summary>

- Tested the whole Github Action Flow
- Tested on different systems (MacOS X64, M1 and Windows thanks @maxeber)
- Reviewed and improved UI
- Fixed bugs when CodePipeline response is not defined
- Fixed time ago integration

</details>

<details>
  <summary>### V1.1.0 - Added Github Actions - 2022-10-01</summary>

- Start Github Actions using the workflow_dispatch
- Added Github Personal Access Token
- Reworked the configuration file to implement multi providers
- Revamp the code structure
- Added Github Actions example

</details>

<details>
  <summary>### V1.0.0 - CodePipeline - 2022-09-30</summary>

- Start CodePipeline
- Update CodePipeline Source Branch Name

</details>

---

## Contributing

1. Create a Feature Branch
2. Commit your changes
3. Push your changes
4. Create a PR

<details>
<summary>Working with your local branch</summary>

**Branch Checkout:**

```bash
git checkout -b <feature|fix|release|chore|hotfix>/prefix-name
```

> Your branch name must starts with [feature|fix|release|chore|hotfix] and use a / before the name;
> Use hyphens as separator;
> The prefix correspond to your Kanban tool id (e.g. abc-123)

**Keep your branch synced:**

```bash
git fetch origin
git rebase origin/master
```

**Commit your changes:**

```bash
git add .
git commit -m "<feat|ci|test|docs|build|chore|style|refactor|perf|BREAKING CHANGE>: commit message"
```

> Follow this convention commitlint for your commit message structure

**Push your changes:**

```bash
git push origin <feature|fix|release|chore|hotfix>/prefix-name
```

**Examples:**

```bash
git checkout -b release/v1.15.5
git checkout -b feature/abc-123-something-awesome
git checkout -b hotfix/abc-432-something-bad-to-fix
```

```bash
git commit -m "docs: added awesome documentation"
git commit -m "feat: added new feature"
git commit -m "test: added tests"
```

</details>

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

- Tommy Gingras @ tommy@studiowebux.com | Studio Webux

---

<div>
<b> | </b>
<a href="https://www.buymeacoffee.com/studiowebux" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 30px !important; width: 105px !important"
/></a>
<b> | </b>
<a href="https://webuxlab.com" target="_blank"
      ><img
        src="https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg"
        alt="Webux Logo"
        style="height: 30px !important"
/> Webux Lab</a>
<b> | </b>
</div>

---
