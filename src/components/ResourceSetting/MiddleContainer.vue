<template>
<div>
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <h6 class="w3-opacity">The current path and filter are as follows :</h6>
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true"> Resource Setter</i>
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true"> Instances</i>
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true"> JCSAgent</i>
                    </p>
                    <p class="w3-col m3 w3-small">
                        <select class="w3-select w3-border w3-round" name="option">
                            <option value="0">Page Number</option>
                            <option value="0">Page 1</option>
                            <option value="1">Page 2</option>
                            <option value="2">Page 3</option>
                        </select>
                    </p>
                    <p class="w3-col m3 w3-margin-right w3-small">
                        <select class="w3-select w3-border w3-round" name="option">
                            <option value="10">Page Size</option>
                            <option value="10">Size 10</option>
                            <option value="25">Size 25</option>
                            <option value="50">Size 50</option>
                            <option value="100">Size 100</option>
                            <option value="500">Size 500</option>
                        </select>
                    </p>
                    <p class="w3-col m3 w3-small">
                        <select class="w3-select w3-border w3-round" name="option">
                            <option value="-1">Order Field</option>
                            <option value="1">Agent Name</option>
                            <option value="2">Update Time</option>
                            <option value="3">Activate</option>
                        </select>
                    </p>
                    <p class="w3-col m2 w3-small">
                        <select class="w3-select w3-border w3-round" name="option">
                            <option value="-1">Type</option>
                            <option value="1">ASC</option>
                            <option value="2">DESC</option>
                        </select>
                    </p>
                    <p class="w3-col m2 w3-small">
                        <select class="w3-select w3-border w3-round" name="option">
                            <option value="-1">Order Field</option>
                            <option value="1">Agent Name</option>
                            <option value="2">Update Time</option>
                            <option value="3">Activate</option>
                        </select>
                    </p>
                    <p class="w3-col m2 w3-small">
                        <select class="w3-select w3-border w3-round" name="option">
                            <option value="-1">Order Type</option>
                            <option value="1">ASC</option>
                            <option value="2">DESC</option>
                        </select>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="obj in objs"><br>
        <img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right" style="height:48px;width:48px">
        <span class="w3-right w3-opacity">{{ obj.lastupdatetime }}</span>
        <p>{{ obj.agentname }}</p>
        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ 'Host:' + obj.host }}</span>
        <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ 'Port:' + obj.port }}</span>
        <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ (obj.activate == 1) ? 'activate' : 'Deactivate' }}</span>
        <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + obj.maximumjob }}</span>
        <hr class="w3-border-black w3-clear">
        <p class="w3-small">{{ obj.description }}</p>
        <button type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="fa fa-pencil"></i> Edit</button>
        <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-trash-o"></i> Delete</button>
    </div>
</div>
</template>
<script>
import { HTTPRepo } from '../../axios/http-common';
export default {
    data() {
        return {
            objs: new Object(),
        }
    },
    mounted() {
        HTTPRepo.get(`jcsagent/findAll`)
            .then(response => {
                this.objs = response.data;
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data)
                } else {
                    alert(error.message)
                }
            })
    }
}
</script>

