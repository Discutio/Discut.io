<template>
  <div class="tagPage">
    <div class="details">
        <h1>Explore discut.io by tags!</h1>
        <p>
            <a :href="'https://steemit.com/trending/discutio'" target="_blank">
                <i class="fas fa-external-link-alt"></i> 
                Show on Steemit
            </a>  
        </p>  
    </div>
    <div class="container header-tabs">
        <div class="row">
          <div class="col-lg-12">
              <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#trending" > Popular tags</a>
                  </li>
              </ul>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="container" v-if="!busy">
            <div class="row">
                <div class="col-lg-6 offset-3">
                    <div class="tags">
                        <div class="_tag" v-for="(item, k) in tags">
                        <router-link class="tag" :to="{ name: 'tag', params: {tag: item.charAt(0).toLowerCase() + item.slice(1) } }">
                            {{item}}
                        </router-link>     
                        </div> 
                        <div style="clear:both;"></div>
                    </div>
                </div> 
            </div>
        </div>
        <div v-if="busy">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12 title loader">
                        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                </div>
            </div>      
        </div>  
      </div>
  </div>
</template>
<script>
export default {
  name: 'tags',
  data() {
    return {
      tags: [],
      busy: true
    }
  },
  components: {},
  methods: {
  },
  mounted()
  {  
      this.tags = this.$store.state.categories;
      this.busy = false;
      $(".navbar").addClass('navbar-active');
  }
}
</script>
<style lang="scss"> 
    .tagPage {
        .tags {
            line-height: 33px;
            display: inline-block;
            position: relative;
            text-align:center;
            width: 100%;
            justify-content: center;
            ._tag {
              float: left;
              display:inline-block;
              .tag {
                margin-right: 10px;
                color: #333;
              }
            }
        }
        .details {
            h1 {
                color: #333;
            }
            p {
                font-size: 12px;
            }
            margin-top: 120px;
            margin-bottom: 50px;
            text-align: center;
        }
        .header-tabs {
            margin-top: 50px;
            .nav-tabs .nav-item .nav-link {
                color: #333;
                &.active {
                    border-bottom: 2px solid #333;
                }
            }
            .nav-item {
                margin-right: 0;
            }
            .nav-tabs {
                display: flex;
                justify-content: center;
            }
        }
        .notFound {
            text-align:center;
            color: #333;
            margin-bottom: 60px;
        }
    }
    .content {
        padding-bottom: 60px;
    }
</style>