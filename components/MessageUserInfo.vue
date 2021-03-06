<template>
  <div class="d-flex justify-content-between flex-wrap order-0">
    <nuxt-link :to="clicklink" class="text-success decornone" :title="'Click to view membership for ' + user.displayname">
      <span class="text-muted small d-flex justify-content-between">
        <ProfileImage :image="user.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
        <span class="flex-grow-1">
          <span class="align-middle">
            Posted by {{ user.displayname }}
          </span>
          <span v-if="milesaway" class="align-middle">
            &bull; <b>about {{ milesaway | pluralize('mile', { includeNumber: true }) }} away</b>
          </span>
          <br class="d-block d-sm-none">
          <span v-if="!modinfo && (user.info.openoffers + user.info.openwanteds > 0)" class="align-middle">
            <span class="d-none d-sm-inline">&bull;</span>
            <span v-if="user.info.openoffers" class="text-success">
              {{ user.info.openoffers | pluralize([ 'open OFFER', 'open OFFERs' ], { includeNumber: true }) }}
            </span>
            <span v-if="user.info.openoffers && user.info.openwanteds">
              &bull;
            </span>
            <span v-if="user.info.openwanteds" class="text-success">
              {{ user.info.openwanteds | pluralize([ 'open WANTED', 'open WANTEDs' ], { includeNumber: true }) }}
            </span>
          </span>
        </span>
      </span>
    </nuxt-link>
    <span v-if="modinfo && membership" class="ml-2 order-1 order-sm-1 small">
      <v-icon name="calendar-alt" />
      <span :class="joinedAge <= 31 ? 'text-danger' : ''">Joined {{ membership.added | dateshort }}</span>
    </span>
    <span v-if="modinfo && membership" class="ml-2 text-truncate small email order-3 order-md-1">
      <!-- eslint-disable-next-line -->
      <v-icon name="hashtag" class="text-muted" scale="0.8" />{{ user.id }}
    </span>
    <ModModeration v-if="modinfo && membership" :user="user" :membership="membership" class="order-2 order-md-3 order-lg-4" />
    <ModPostingHistory v-if="modinfo" :user="user" class="order-4 order-md-4 order-lg-3 mt-1 mt-md-0" />
    <ModMemberships v-if="modinfo" :user="user" class="order-5" />
  </div>
</template>

<script>
import ModPostingHistory from './ModPostingHistory'
import ModMemberships from './ModMemberships'
import ProfileImage from '~/components/ProfileImage'
const ModModeration = () => import('./ModModeration')

export default {
  components: {
    ModMemberships,
    ModPostingHistory,
    ModModeration,
    ProfileImage
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: false,
      default: null
    },
    milesaway: {
      type: Number,
      required: false,
      default: null
    },
    modinfo: {
      type: Boolean,
      default: false
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    membership() {
      let ret = null

      if (this.groupid && this.user && this.user.memberof) {
        ret = this.user.memberof.find(g => g.id === this.groupid)
      }

      return ret
    },
    joinedAge() {
      if (this.membership) {
        return new this.$dayjs().diff(
          new this.$dayjs(this.membership.added),
          'days'
        )
      }

      return null
    },
    clicklink() {
      const modtools = this.$store.getters['misc/get']('modtools')

      if (modtools) {
        return '/modtools/members/approved/search/' + this.user.id
      } else {
        return '/profile/' + this.user.id
      }
    }
  }
}
</script>
<style scoped>
.email {
  max-width: 200px;
}
</style>
