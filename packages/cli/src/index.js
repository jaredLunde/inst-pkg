#!/usr/bin/env node
/**
 # Creates a new Yarn monorepo
inst init
inst init [workspace-name]

 # Creates a template
inst template [template-name]

 # Creates a new workspace from a provided template
inst add @stellar-apps/serverless-react-app serverless-react-app

 **/
import bin from './bin'
bin()
