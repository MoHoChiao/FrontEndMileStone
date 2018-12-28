<<template>
<div class="w3-small">
    <!-- For Apply Permission Window -->
    <permission-window :windowAlive="applyPermissionWindowAlive" 
                    window-title="Apply Permission To "
                    :objectUid="selectedRecord.parentuid + selectedRecord.aliasname" 
                    :objectName="selectedRecord.aliasname" 
                    whichForm="USE"
                    @closeApply="changePermissionWindowStatus" 
    ></permission-window>
    <div v-if="alias.length > 0">
        <div class="w3-responsive w3-card w3-round">
            <table class="w3-table-all">
                <tr class="w3-teal">
                    <th class="" width="25%">Alias Name</th>
                    <th class="w3-center" width="12%">Type</th>
                    <th class="" width="25%">Target</th>
                    <th class="" width="30%">Description</th>
                    <th class="w3-center" width="8%">Permission</th>
                </tr>
            </table>
        </div>
        <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px;word-break:break-all">
            <table class="w3-table-all">
                <tr :key="list_info.parentuid+':'+list_info.aliasname" v-for="(list_info, list_index) in alias">
                    <td width="25%"><span>{{ list_info.aliasname }}</span></td>
                    <td class="w3-center" width="10%">
                        <span v-if="list_info.aliastype == 'Agent'" class="w3-badge w3-red" title="Agent">A</span>
                        <span v-if="list_info.aliastype == 'Connection'" class="w3-badge w3-indigo" title="Connection">C</span>
                        <span v-if="list_info.aliastype == 'Domain'" class="w3-badge w3-flat-turquoise" title="Domain">D</span>
                        <span v-if="list_info.aliastype == 'Filesource'" class="w3-badge w3-dark-grey" title="Filesource">F</span>
                        <span v-if="list_info.aliastype == 'Frequency'" class="w3-badge w3-grey" title="Frequency">F</span>
                    </td>
                    <td width="27%"><span>{{ list_info.objectname }}</span></td>
                    <td width="30%"><span>{{ list_info.description }}</span></td>
                    <td class="w3-center" width="8%" style="padding-top:3px;padding-bottom:0px">
                        <i class="fa fa-universal-access w3-button w3-hover-none" title="Apply Use Permission to Alias" 
                            aria-hidden="true" @click="changePermissionWindowStatus(list_info)"></i>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
</template>
<script>
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'

export default {
    data() {
        return {
            selectedRecord: new Object(),   //store which record has been selected.(Business Entity)
            applyPermissionWindowAlive: false, //for modify Permission modal windows
        }
    },
    props: {
        alias: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        //above for permission window
        changePermissionWindowStatus(record){
            if(record){
                this.selectedRecord = record
                this.selectedRecord.parentuid = this.selectedRecord.parentuid.trim()
            }

            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
        }
    },
    components: {
        'permission-window': PermissionWindow
    }
}
</script>
