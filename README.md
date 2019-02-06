# inst-pkg
A workspace manager integrated with Yarn for quickly constructing workspaces from boilerplates
using a basic template engine and integrated CLI prompts.

### Installation
`yarn global add @inst-pkg/cli`

--------------------------------------------------------------------------------
```bash
# Creates a new boilerplate in the current working directory
inst template @stellar-apps/serverless-react-app

# Creates a new workspace with the `@stellar-apps/serverless-react-app` boilerplate
inst add @stellar-apps/serverless-react-app
```
--------------------------------------------------------------------------------

## `@inst-pkg/cli`
### `inst init [workspace]`
Creates a new Inst+Yarn workspace at the `path.join(process.env.CWD, workspace)`. The
workspace comes with a script called `inst` and you're encourage to use `yarn inst` 
instead of `inst` from here on out when inside the workspace.
- `workspace`
    - The name and directory of your new workspace.

----

### `yarn inst add [template] [name] [--cwd=directory]`
Adds a new package to your workspace installed from the `template` positional argument. 
If using `yarn inst`, the new package will automatically appear in the directory 
`[workspace]/packages/[name]`

- `template`
    - The NPM package, git repo, or local template to create a workspace from
    - **Examples**
```bash
yarn inst some-npm-inst-template
yarn inst file:/path/to/my/local/template
yarn inst https://github.com/jaredLunde/cool-github-inst-template
```
- `name`
    - The name of the new package in your workspace. If not provided you will be prompted 
      for a name.
- `--cwd`
    - Joins the process.cwd() to this path when creating the environment
    
----

### `inst template [template-name] [--cwd=directory]`
Creates a new blank template in the current working directory or `--cwd`. This template
can then be installed via `inst add` above.

- `template-name`
    - The name of the new template you're creating
- `--cwd`
    - Joins the process.cwd() to this path when creating the environment
    