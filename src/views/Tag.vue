<template>
  <div class="tagPage">
    <div class="details">
        <h1>#{{item.name}}</h1>
        <p>
            <a :href="'https://steemit.com/trending/' + item.steemName" target="_blank">
                <i class="fas fa-external-link-alt"></i> 
                #{{item.steemName}}
            </a>  
        </p>  
    </div>
    <div class="container header-tabs">
        <div class="row">
          <div class="col-lg-12">
              <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#trending" @click="loadContent('trending', item.steemName)"> Trending</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#hot" @click="loadContent('hot', item.steemName)">
                      <i class="fa fa-fire" aria-hidden="true"></i> Hot
                    </a>   
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#new" @click="loadContent('new', item.steemName)"> New</a>
                  </li>
              </ul>
          </div>
        </div>
      </div>
      <div class="content content-tag">
                <div class="container" v-if="!busy">
                  <div class="row" v-if="discussions.length"> 
                      <div class="col-lg-3" v-for="item in discussions">
                        <div class="discussion-widget">
                          <div class="self-img"  :style="{ backgroundImage: 'url(' + item.img + ')' }">
                            <div class="shadow-inset"></div>
                            <div class="self">
                              <router-link class="tag" :to="{ name: 'tag', params: {tag: item.category } }">
                                {{item.category}}
                              </router-link>    
                            </div>
                            <div class="action"> 
                              <router-link :to="{ name: 'discussion', params: {user: item.by, slug: item.slug } }">
                                <h2>{{item.title}}</h2>
                              </router-link>    
                            </div>  
                          </div>
                          <div class="desc"> 
                             <img :src="item.avatar"> 
                            {{item.by}}

                            <div class="pull-right"> 
                              ${{item.price}}
                            </div>
                          </div>
                        </div>       
                      </div>
                  </div>
                  <div class="row" v-if="!discussions.length">
                      <div class="col-lg-4 offset-4 error">
                        <h3>We didn't found any discussion 😭</h3>
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
  name: 'tag',
  data() {
    return {
      item: {name: '', steemName: ''},
      discussions: [],
      busy: true
    }
  },
  components: {},
  methods: {
    loadContent: function(type, tagName)
    {
      this.busy = true;
      this.discussions = [];
      let params = {"tag": tagName, "limit": 24};

      switch(type)
      {
        case 'new':
          steem.api.getDiscussionsByCreated(params, (err, result) => this.executeContentRequest(err, result));  
          break;
        case 'trending':
          steem.api.getDiscussionsByTrending(params, (err, result) => this.executeContentRequest(err, result));  
          break;
        case 'hot':
          steem.api.getDiscussionsByHot(params, (err, result) => this.executeContentRequest(err, result));  
          break;    
      }  
    },
    executeContentRequest: function(err, result, firstLoad)
    {
      {
        if (!err) 
        {  
          $.each(result, (i, v) =>
          {
            v.json_metadata = JSON.parse(v.json_metadata);

            if(typeof v.json_metadata.category == "unedfined")
            {
                return true;  
            }

            this.discussions.push({
                'title' : v.json_metadata.title,
                'desc' : '',
                'by' : v.author,
                'price' : parseFloat(v.pending_payout_value.split(" ")[0]).toFixed(2),
                'img' : (typeof v.json_metadata.image == "undefined" ? "" : v.json_metadata.image[0]),
                'category' : (v.json_metadata.category.split("-")[1]),
                'avatar' : v.json_metadata.userImg, 
                'slug' : v.permlink
            });
          });

          this.busy = false;
        }
      }
    }
  },
  mounted()
  {  
    this.item.name = this.$route.params.tag;
    this.item.steemName = 'discutio-' + this.item.name;

    this.loadContent('new', this.item.steemName);
    $(".navbar").addClass('navbar-active');
  }
}
</script>
<style lang="scss"> 
    .tagPage {
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
            .nav-tabs {
                display: flex;
                justify-content: center;
            }
        }
        .error { 
            text-align:center;
            color: #333;
            margin-bottom: 60px;
        }
        .content-tag {
            padding-bottom: 0;
        }
    }
</style>