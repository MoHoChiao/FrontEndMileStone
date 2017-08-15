<template>
  <div id="app-card-ex" class="w3-container">
    <app-card app-title="My Test APP Card" 
              img-src="/src/assets/images/FlexWebUI 128.png" 
              :content-list="contentList" 
              bg-color="light-blue" 
              hover-color="light-grey" 
              round="large" 
    ></app-card>
  </div>
</template>

<script>
import AppCard from '../components/card/AppCard.vue';

export default {
  name: 'app-card-ex',
  data () {
    return {
      contentList: [
        {
          text: 'User/User Group Design',
          color: 'red'
        },
        {
          text: 'test2',
          size: 'small',
          color: 'light-blue'
        },
        {
          text: 'test3',
          size: 'medium',
          color: 'signal-orange'
        },
        {
          text: 'test4',
          size: 'large',
          color: 'camo-olive'
        },
        {
          text: 'test5',
          size: 'xlarge',
          color: 'camo-olive'
        },
        {
          text: 'test6',
          size: 'xxlarge',
          color: 'black'
        },
        {
          text: 'test7',
          size: 'xxxlarge',
          color: 'yellow'
        },
        {
          text: 'test8',
          size: 'jumbo',
          color: 'indigo'
        }
      ]
    }
  },
  components: {
    'app-card': AppCard
  }
}
</script>