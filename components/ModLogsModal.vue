<template>
  <div>
    <b-modal
      :id="'modLogsModal-' + userid + '-' + modmailsonly"
      v-model="showModal"
      :title="title"
      size="xl"
      no-stacking
    >
      <template slot="default">
        <NoticeMessage v-if="!busy && (!user || !user.logs || !logs.length)" variant="info">
          There are no logs to show.
        </NoticeMessage>
        <div v-else>
          <ModLog v-for="log in logs" :key="'log-' + log.id" :log="log" />
        </div>
        <infinite-loading :key="'infinite-' + userid" @infinite="fetchChunk">
          <span slot="no-results" />
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" alt="Loading" />
          </span>
        </infinite-loading>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="primary" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import NoticeMessage from './NoticeMessage'
import ModLog from './ModLog'

export default {
  components: { ModLog, NoticeMessage, InfiniteLoading },
  props: {
    userid: {
      type: Number,
      required: true
    },
    modmailsonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      busy: false,
      showModal: false,
      logs: []
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/get'](this.userid)
    },
    title() {
      let ret

      if (this.modmailsonly) {
        ret = 'Modmails '
      } else {
        ret = 'Logs '
      }

      ret += this.user ? 'for ' + this.user.displayname : ''

      return ret
    }
  },
  methods: {
    async show() {
      // Clear the log context - otherwise if we open another modal for this user then it will get confused and
      // fetch from a previous context and show no logs.
      await this.$store.dispatch('user/clearLogContext', {
        id: this.userid
      })

      this.logs = []
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async fetchChunk($state) {
      this.busy = true
      const currentCount = this.logs.length

      await this.$store.dispatch('user/fetch', {
        id: this.userid,
        logs: true,
        info: true,
        modmailsonly: this.modmailsonly,
        logcontext:
          this.user && this.user.logcontext ? this.user.logcontext : null
      })

      // The logs are returned in chunks - grab the next chunk and append to ours.
      const logs = this.user && this.user.logs ? this.user.logs : []
      this.logs = this.logs.concat(logs)

      if (!logs.length || logs.length < currentCount) {
        // We've returned less than a chunk, so we must be done.
        $state.complete()
      } else {
        $state.loaded()
      }

      this.busy = false
    }
  }
}
</script>
