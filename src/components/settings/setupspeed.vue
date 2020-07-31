<template>
    <div class="row mt-3">
        <div class="col">
            <input class="form-control" type="text" v-model="speed" @change="save" />
        </div>
        <div class="col">
            <input class="form-control" type="color" v-model="color" @change="save" />
        </div>
        <div class="col text-nowrap">
            <button type="button" class="btn btn-danger" v-on:click.prevent="deleteThis">
                <span class="glyphicon glyphicon-trash">-</span>
            </button>
        </div>
    </div>
</template>

<script>

    export default {
        name: "setupspeed",
        props: ['value',"index"],
        data() {
            return {
                speed: this.value.speed,
                color: this.value.color,
            }
        },
        async mounted() {
            // loadConfig
            //console.log(this.value);
        },
        methods: {
            save (){
                this.$emit("save",{ index:this.index,color:this.color,speed:this.speed});
            },
            deleteThis(){
                this.$emit("delete",this.index);
            }
        }
    }
</script>
