<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div class="w3-small w3-section w3-card" slot="content">
            <div class="w3-responsive w3-card-0 w3-round">
                <table class="w3-table-all w3-small">
                    <tr class="w3-teal" style="cursor: pointer">
                        <th class="w3-left" width="10%" style="padding-top:4px" @click="sortBy('checked')">
                            <input class="w3-check" type="checkbox" v-model="checkAllFlag" @click.stop="onClickCheckAll">
                            <span v-if="this.sortKey == 'checked' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                            <span v-else-if="this.sortKey == 'checked' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                        </th>
                        <th class="w3-left" width="90%" @click="sortBy('username')">
                            {{ $t('Window.Member.UserList') }}
                            <span v-if="this.sortKey == 'username' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                            <span v-else-if="this.sortKey == 'username' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                        </th>
                    </tr>
                </table>
            </div>
            <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                <table id="freqCategoryTable" class="w3-table-all w3-small">
                    <template v-for="(user, index) in sortedData">
                        <tr :id="user.useruid" :key="user.useruid">
                            <td class="w3-left" width="10%" style="padding-top:4px">
                                <input class="w3-check" type="checkbox" v-model="user.checked">
                            </td>
                            <td class="w3-left" width="90%">
                                <span>{{ user.username }} ({{ user.userid }})</span>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import ModalWindow from '../../../Common/window/ModalWindow.vue'
    import FormButton from '../../FormButton.vue'
    import orderBy from 'lodash/orderBy'

    export default {
        data() {
            return {
                checkAllFlag: false,
                trinityusers: [],
                sortKey: 'username',
                sortOrder: 'ASC'
            }
        },
        computed: {
            windowTitle() {
                return this.$t('Window.Account.AddUser')
            },
            sortedData: function () {
                if (this.sortKey == 'checked')
                    return orderBy(this.trinityusers, [this.sortKey, 'username'], [this.sortOrder.toLowerCase(), 'asc']);
                else
                    return orderBy(this.trinityusers, this.sortKey, this.sortOrder.toLowerCase());
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
            groupuid: '',
            groupname: '',
            memberUids: {
                type: Array,
                default: () => []
            }
        },
        created() {
            this.getTrinityUser()
        },
        methods: {
            sortBy: function (key) {
                if (key == this.sortKey) {
                    this.sortOrder = (this.sortOrder == 'ASC') ? 'DESC' : 'ASC';
                } else {
                    this.sortKey = key;
                    this.sortOrder = 'ASC';
                }
            },
            cancel() {
                this.$emit('closeApply')
            },
            onClickCheckAll() {
                this.selectedRecords = []
                if (this.checkAllFlag) {
                    for (let i = 0; i < this.trinityusers.length; i++) {
                        this.trinityusers[i].checked = false //單純為了在UI把checkbox取消而已
                    }
                } else {
                    for (let i = 0; i < this.trinityusers.length; i++) {
                        this.trinityusers[i].checked = true //單純為了在UI把checkbox勾起來而已
                    }
                }
            },
            getTrinityUser() {
                HTTP_TRINITY.get(`trinity-user/findAll`)
                    .then(response => {
                        this.trinityusers = []
                        for (let i = 0; i < response.data.length; i++) {
                            if (!this.memberUids.includes(response.data[i].useruid) && response.data[i].useruid.trim() !== 'trinity') {
                                response.data[i].checked = false
                                this.trinityusers.push(response.data[i])
                            }
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            reset() {
                this.checkAllFlag = false
                this.selectedRecords = []
                this.getTrinityUser()
            },
            save() {
                var retRecords = []

                for (let i = 0; i < this.trinityusers.length; i++) {
                    if (this.trinityusers[i].checked)
                        retRecords.push(this.trinityusers[i])
                }

                if (retRecords.length > 0) {
                    HTTP_TRINITY.post('group-member/addBatch?groupUid=' + this.groupuid, retRecords)
                        .then(response => {
                            this.$emit('applyMembers')
                            this.cancel()
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                } else {
                    this.cancel()
                }
            }
        },
        components: {
            'modal-window': ModalWindow,
            'form-button': FormButton
        }
    }
</script>
<style scoped>

    input.w3-check {
        height: 16px
    }
</style>