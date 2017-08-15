<template>
<div class="container">
    <div class="row">
        <div class="col-md-4 col-sm-4 hidden-lg" v-for="appContent in appsContent">
            <app-card :app-title="appContent.appTitle" 
              :img-src="appContent.imgSrc" 
              :content-list="appContent.contentList" 
              bg-color="white" 
              hover-color="light-grey" 
              round="xlarge" 
            >
                <login-btn class="w3-margin-bottom" btn-text="Login" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    window-title="Welcome to sign in" 
                    form-action="/test" 
                ></login-btn>
            </app-card>
        </div>
        <div class="col-md-3 col-sm-3 visible-lg" v-for="appContent in appsContent">
            <app-card :app-title="appContent.appTitle" 
              :img-src="appContent.imgSrc" 
              :content-list="appContent.contentList" 
              bg-color="white" 
              hover-color="light-grey" 
              round="xlarge" 
            >
                <login-btn class="w3-margin-bottom" btn-text="Login" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    window-title="Welcome to sign in" 
                    form-action="/test" 
                ></login-btn>
            </app-card>
        </div>
    </div>
    <div class="slideThree pull-right">  
            <input 
              type="checkbox"
              v-model="lang"
              :true-value="'tw'"
              :false-value="'en'"
              @change="setLanguage( lang )"
              id="slideThree"/>
            <label for="slideThree"></label>
          </div>
</div>
</template>
</div>
</template>
<script>
import AppCard from '../card/AppCard.vue';
import LoginBtn from '../button/LoginBtn.vue';

export default {
    data () {
        return {
            appsContent: [{
                appTitle: 'Resource Config',
                imgSrc: '/src/assets/images/FlexWebUI 128.png',
                windowTitle: 'Sign in to the App Setting',
                contentList: [
                    {text: 'appCardContent.User_Group_Access_Design'},
                    {text: 'appCardContent.Job_Frequency_Design'},
                    {text: 'appCardContent.DB_Connection_Define'},
                    {text: 'appCardContent.JCS_Agent_Define'},
                    {text: 'appCardContent.Alias_Domain_Define'}
                ]
            },
            {
                appTitle: 'JF Designer',
                imgSrc: '/src/assets/images/JFDesigner 128.png',
                windowTitle: 'Sign in to the JF Designer',
                contentList: [
                    {text: 'appCardContent.Entity_Category_Job_Define'},
                    {text: 'appCardContent.Job_Step_Design'},
                    {text: 'appCardContent.Flow_Map_Design'},
                    {text: 'appCardContent.Job_Schedule_Assign'},
                    {text: 'appCardContent.Import_Export_Operation'}
                ]
            },{
                appTitle: 'Task Console',
                imgSrc: '/src/assets/images/TaskConsole 128.png',
                windowTitle: 'Sign in to the Task Console',
                contentList: [
                    {text: 'appCardContent.Job_Flow_Task_Execution'},
                    {text: 'appCardContent.Job_Flow_Task_Monitor'},
                    {text: 'appCardContent.JCS_Server_Agent_Monitor'},
                    {text: 'appCardContent.Resource_Monitor'},
                    {text: 'appCardContent.Task_Log_Viewer'}
                ]
            },{
                appTitle: 'Metaman',
                imgSrc: '/src/assets/images/MetaMan Logo 128.png',
                windowTitle: 'Sign in to the Metaman',
                contentList: [
                    {text: 'appCardContent.Tech_Meta_Design'},
                    {text: 'appCardContent.Business_Meta_Design'},
                    {text: 'appCardContent.App_Meta_Design'},
                    {text: 'appCardContent.ER_Lineage_Model_Design'},
                    {text: 'appCardContent.Data_Profile'}
                ]
            }]
        }
    },
    methods: {
        setLanguage (val) {
            this.$i18n.locale = val
        }
    },
    components: {
        'app-card': AppCard,
        'login-btn': LoginBtn
    }
}
</script>
<style lang="scss">
  $switch-width: 160px;
  $switch-labal-width: 80px;
  $switch-background: #a4daff;
  $switch-font-color: #333;
  .slideThree {
    width: $switch-width;
    height: 26px;
    background: $switch-background;
    position: relative;
    border-radius: 50px;
    box-shado: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
    &:after {
      content: 'English';
      color: $switch-font-color;
      position: absolute;
      right: 12px;
      z-index: 0;
      font-size: 12px;
      line-height: 26px;
      text-shadow: 1px 1px 0px rgba(255,255,255,.15);
    }
    &:before {
      content: '繁體';
      color: $switch-font-color;
      position: absolute;
      left: 24px;
      z-index: 0;
      font-size: 12px;
      line-height: 26px;
    }
    label {
      display: block;
      width: $switch-labal-width;
      height: 20px;
      cursor: pointer;
      position: absolute;
      top: 3px;
      left: 3px;
      z-index: 1;
      background: #fcfff4;
      background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
      border-radius: 50px;
      transition: all 0.4s ease;
      box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.3);
    }
    input[type=checkbox] {
      visibility: hidden;
      &:checked + label {
        left: 78px;
      }
    }    
  }
</style>

