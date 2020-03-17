<template>
    <div class="ui container">
        <br/>
        <div class="ui text container">
            <div class="ui segments">

                <div class="ui segment" v-for="setting in settings" :key="setting.name">
                    <div class="ui icon message">
                        <img width="60" height="60" alt="message-icon"
                             :src="'../public/icons/'+setting.icon">
                        <div class="content">
                            <div class="header">
                                <div class="ui input">
                                    <input :name="setting.name+'_text'"
                                           v-model.trim="setting.text"
                                           @change="(e)=>onValueChange(e,'text', setting)"
                                           minlength="0" maxlength="100"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w3-light-grey">
                        <div class="w3-grey" style="height:24px;width:50%"></div>
                    </div>
                    <div class="ui form">
                        <div class="three fields">
                            <div class="field">
                                <label>Show in </label>
                                <div class="ui right labeled input">
                                    <input :name="setting.name+'_timeoutSeconds'"
                                           type="number" step="1"
                                           v-model.number="setting.timeoutSeconds"
                                           @change="(e)=>onValueChange(e,'timeoutSeconds', setting)"
                                           placeholder="Enter seconds" min="1" max="3600">
                                    <div class="ui basic label">
                                        seconds
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Hide in </label>
                                <div class="ui right labeled input">
                                    <input :name="setting.name+'_displayForSeconds'"
                                           type="number" step="1"
                                           v-model.number="setting.displayForSeconds"
                                           @change="(e)=>onValueChange(e,'displayForSeconds', setting)"
                                           placeholder="Enter seconds" min="1" max="3600">
                                    <div class="ui basic label">
                                        seconds
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Allow pausing</label>
                                <button class="fluid ui button toggle"
                                        :name="setting.name+'_allowPausing'"
                                        @click="(e)=>onValueChange(e,'allowPausing', setting)"
                                        :class="{active:setting.allowPausing}">
                                    {{setting.allowPausing ? "On" : "Off"}}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <collapse-transition :delay="300">
                    <div v-show="valueChanged">
                        <button class="ui button fluid bottom attached"
                                @click="reset()"
                        >
                            Reset
                        </button>
                    </div>

                </collapse-transition>
            </div>
        </div>
        <div class="ui vertical footer segment">
            <div class="ui center aligned container">
                <p>Code by Lukas Vyslocky (<a href="mailto:lukas.vyslocky@gmail.com" title="lukas.vyslocky@gmail.com">lukas.vyslocky@gmail.com</a>) </p>
                <p>Icons made by <a href="https://www.flaticon.com/authors/fjstudio" title="fjstudio">fjstudio</a> from
                    <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></p>
            </div>
        </div>
    </div>
</template>

<script>
    import {SettingsService} from "./services/SettingsService";
    import {CollapseTransition} from 'vue2-transitions';

    export default {
        name      : "App",
        components: {
            CollapseTransition
        },
        data      : function () {
            return {
                settings       : [],
                defaultSettings: [],
                valueChanged   : SettingsService.isNotDefault(),
            }
        },
        created() {
            this.settings = SettingsService.get();
            this.defaultSettings = SettingsService.get();
        },
        methods   : {
            onValueChange(e, key, setting) {
                console.log(e, key, setting)
                this.settings = SettingsService.set(setting.name, key, e.target.value);
                this.valueChanged = JSON.stringify(this.defaultSettings) !==
                                    JSON.stringify(this.settings);
            },
            reset() {
                this.defaultSettings = SettingsService.reset();
                this.settings = SettingsService.get();
                this.valueChanged = false;
            }
        }
    }
</script>
