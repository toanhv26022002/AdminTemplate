<template>
  <div class="text-center">
    <v-dialog v-model="dialogVisible" persistent width="1000">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ title }}
        </v-card-title>
        <v-card-text class="d-flex flex-row">
          <div class="flex-none pa-5" style="width: 50%">
            <v-text-field v-model="rasterBand.nodata" type="number" label="Nodata"  variant="outlined"
              :rules="[rules.float]" />
            <v-select v-model="rasterBand.sampling" :items="samplings" label="Sampling"  variant="outlined" />
            <v-select v-model="rasterBand.data_type" :items="dataTypes" label="Data Type" />
            <v-text-field v-model="rasterBand.bits_per_sample" label="Bits per sample" :rules="[rules.float]"
               variant="outlined" />
            <v-text-field v-model="rasterBand.spatial_resolution" :rules="[rules.float]" label="Spatial Resolution"
               variant="outlined" />

            <v-text-field v-model="rasterBand.unit" label="Unit" :rules="[rules.string]"  variant="outlined" />
            <v-text-field v-model="rasterBand.scale" :rules="[rules.float]" label="Scale"  variant="outlined" />
            <v-text-field v-model="rasterBand.offset" :rules="[rules.float]" label="Offset"  variant="outlined" />
          </div>
          <div class="flex-none pa-5" style="width: 50%">
            <v-card>
              <v-card-title class="grey lighten-2">
                Statistics
              </v-card-title>
              <v-card-text class="pt-2">
                <div class="field-container">
                  <v-text-field v-model="rasterBand.statistics.minimum" :rules="[rules.float]" label="Minimum"
                     variant="outlined" />
                  <v-text-field v-model="rasterBand.statistics.maximum" :rules="[rules.float]" label="Maximum"
                     variant="outlined" />
                </div>
                <div class="field-container">
                  <v-text-field v-model="rasterBand.statistics.mean" :rules="[rules.float]" type="number" label="Mean"
                     variant="outlined" />
                  <v-text-field v-model="rasterBand.statistics.stddev" :rules="[rules.float]" type="number" label="Stddev"
                     variant="outlined" />
                </div>
                <v-text-field v-model="rasterBand.statistics.valid_percent" :rules="[rules.float]" type="number"
                  label="Valid Percent"  variant="outlined" />
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-title class="grey lighten-2">
                Histogram
              </v-card-title>
              <v-card-text class="pt-2">
                <v-text-field v-model="rasterBand.histogram.count" :rules="[rules.integer]" type="number" label="Count"
                   variant="outlined" />
                <div class="field-container">
                  <v-text-field v-model="rasterBand.histogram.min" :rules="[rules.float]" type="number" label="Minimum"
                     variant="outlined" />
                  <v-text-field v-model="rasterBand.histogram.max" :rules="[rules.float]" type="number" label="Maximum"
                     variant="outlined" />
                </div>
                <v-combobox v-model="rasterBand.histogram.buckets" :rules="[rules.integer]" type="number" :items="items" label="Buckets"
                   variant="outlined" multiple class="row">
                  <template v-slot:chip="data">
                    <v-chip :key="data.index" v-bind="data" :model-value="data" size="small" closable
                      @click:close="removeHistogramBucket(data.index)" :label="true">
                    </v-chip>
                  </template>
                </v-combobox>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="submit">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';

export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "Required.",
        float: (value) => !isNaN(value) || "Must be a number",
        integer: (value) => Number.isInteger(parseInt(value)) || "Must be an integer",
        string: (value) => typeof value === "string" || "Must be a string",
      },
      dialogVisible: false,
      title: "Raster Band",
      defaultRasterBand: {
        nodata: 0,
        sampling: "",
        data_type: "",
        bits_per_sample: null,
        spatial_resolution: null,
        statistics: {
          minimum: null,
          maximum: null,
          mean: null,
          stddev: null,
          valid_percent: null,
        },
        unit: "",
        scale: null,
        offset: null,
        histogram: {
          count: null,
          min: null,
          max: null,
          buckets: [],
        },
      },
      rasterBand: {

      },
      bucket: null,
      role: "",
      index: undefined,
      samplings: ["area", "point"],
      dataTypes: [
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "int8",
        "int16",
        "int32",
        "int64",
        "float16",
        "float32",
        "float64",
        "cint16",
        "cint32",
        "cfloat32",
        "cfloat64",
        "other",
      ],
    };
  },
  created() {
    this.resetForm();
  },
  methods: {
    open(title, index, rasterBand) {
      this.dialogVisible = true;
      this.title = title;
      this.index = index;
      if (rasterBand) {
        this.rasterBand = rasterBand;
      } else {
        this.rasterBand = cloneDeep(this.defaultRasterBand);
      }
    },

    submit() {
      this.$emit("submit", this.index, this.rasterBand);
    },
    close() {
      this.dialogVisible = false;
    },

    // addHistogramBucket() {
    //   if (!Number.isInteger(parseInt(this.bucket))) {
    //     return;
    //   }
    //   this.rasterBand.histogram.buckets.push(parseInt(this.bucket));
    //   this.bucket = null;
    // },

    removeHistogramBucket(index) {
      console.log(index);
      this.rasterBand.histogram.buckets.splice(index, 1);
    },

    resetForm() {
      this.rasterBand = cloneDeep(this.defaultRasterBand);
    },

    cancel() {
      this.resetForm();
      this.close();
    },
  },
};
</script>
<style scoped>
.field-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.field-container>* {
  width: 40%;
}

.v-text-field {
  padding: 5px;
}
</style>
