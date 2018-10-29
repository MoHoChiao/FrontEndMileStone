<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <connection-form v-if="urlOp === 'add'" slot="content" ref="connectionForm"></connection-form>
        <connection-form v-else slot="content" ref="connectionForm" :content="content" :urlOp="urlOp"></connection-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
        
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import ConnectionForm from './ConnectionForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return this.$t('Window.Resource.AddConn')
            else if(this.urlOp === 'edit')
                return this.$t('Window.Resource.EditConn') + ' - ' + this.content.connectionname
            else if(this.urlOp === 'copy')
                return this.$t('Window.Resource.CopyConn') + ' - ' + this.content.connectionname
            else if(this.urlOp === 'move')
                return this.$t('Window.Resource.MoveConn') + ' - ' + this.content.connectionname
        }
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        content: {
            type: Object,
            default () {
                return {
                    connectionuid: '',
                    connectionname: '',
                    description: '',
                    connectiontype: 'D',
                    pimendpointtype: '',
                    pimendpointname: '',
                    pimaccountcontainer: '',
                    pimaccountname: '',
                    withpim: '0',
                    userid: '',
                    server: '',
                    password: '',
                    targetdir: '',
                    jdbc_dbType: 'AS400',
                    jdbc_url: 'jdbc:as400://host/libname',
                    jdbc_driver: 'com.ibm.as400.access.AS400JDBCDriver',
                    host: '',
                    port: 25,
                    mailssl: '0',
                    mailtls: '0',
                    user: '',
                    notesHostIP: '',
                    notesIor: '',
                    notesServerName: '',
                    notesDBName: '',
                    saplanguage: '',
                    sapSystemNumber: '',
                    sapSystemName: '',
                    sapHostIP: '',
                    sapCodePage: '',
                    sapClient: '',
                    categoryname: '/',
                    categoryuid: 'root'
                }
            }
        },
        selectedCategoryRecord: {
            type: Object,
            default () {
                return {
                    conncategoryuid: '',
                    conncategoryname: '',
                    description: ''
                }
            }
        },
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        cancel(){
            if(this.urlOp === 'add')
                this.$emit('closeAdd')
            else if(this.urlOp === 'edit')
                this.$emit('closeEdit')
            else if(this.urlOp === 'copy'){
                this.$emit('closeCopy')
            }else if(this.urlOp === 'move')
                this.$emit('closeMove')
        },
        save(){
            let postContent = this.$refs.connectionForm.save()

            let urlPath = ''
            if (this.urlOp === 'add') {   //新增一筆connection
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid && 
                        this.selectedCategoryRecord.conncategoryuid !== ''){  //在某個connection category底下新增一筆connection
                    urlPath = this.urlOp + '?categoryUid=' + this.selectedCategoryRecord.conncategoryuid
                }else{  //在root位置新增一筆connection
                    urlPath = this.urlOp
                }
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的connection
                urlPath = this.urlOp
            } else if(this.urlOp === 'copy'){   //複制一筆已存在的connection, 到某個connection category底下
                /*
                 * 寫死add方法,因為其實copy就等於是add方法的行為
                 * 沒有回傳categoryuid則表示是在root底下新增connection, 此時urlPath只需'add'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.categoryuid && postContent.categoryuid.trim().length > 0)    //當categoryuid有值, 表示有選擇某一個category
                        urlPath = 'add?categoryUid=' + postContent.categoryuid
                    else    //如果選擇'/'表示根目錄, 只需要add即可
                        urlPath = 'add'
                }
            } else if(this.urlOp === 'move'){   //移動一筆已存在的connection, 到某個connection category底下
                /*
                 * 寫死edit方法,因為其實move就等於是edit方法的行為
                 * 沒有回傳categoryuid則表示是把connection移動到root底下, 此時urlPath只需'edit'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.categoryuid && postContent.categoryuid.trim().length > 0)    //當categoryuid有值, 表示有選擇某一個category
                        urlPath = 'edit?categoryUid=' + postContent.categoryuid
                    else    //表示選擇'/'表示根目錄, categoryUid代為空字串
                        urlPath = 'edit?categoryUid='
                }
            }else {
                return
            }
            
            if(postContent){
                HTTP_TRINITY.post(`connection/` + urlPath, postContent)
                .then(response => {
                    //把category info append回給container來顯示
                    response.data.categoryuid = postContent.categoryuid
                    response.data.categoryname = postContent.categoryname
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }else if(this.urlOp === 'copy'){  //copy operation
                        this.$emit('closeCopy', response.data)
                    }else if(this.urlOp === 'move'){  //move operation
                        this.$emit('closeMove', response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.connectionForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'connection-form': ConnectionForm,
        'form-button': FormButton
    }
}
</script>