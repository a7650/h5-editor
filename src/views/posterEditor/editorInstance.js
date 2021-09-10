/* eslint-disable prefer-const */
import { SyncHook, SyncBailHook, AsyncParallelHook } from 'tapable'

export class EditorInstance {
  constructor() {
    this.hooks = Object.freeze({
      initialize: new SyncBailHook(),
      beforeAddWidget: new SyncBailHook(),
      afterAddWidget: new SyncHook(),
      setBackup: new SyncBailHook(),
      recoverBackup: new SyncBailHook(),
      save: new SyncBailHook(),
      exitPage: new SyncBailHook()
    })
    this.$componentInstance = null
  }
}

export let editorInstance = new EditorInstance()
