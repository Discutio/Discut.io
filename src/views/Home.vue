<template>
<div>
        <div class="header navbar-hook" :style="{'background-image':'url('+mostPopularDiscussion.img+')'}">
              <div class="shadow-inset"></div>
              <div class="top-thread">
                <p>{{tip}}</p> 
                <h1>{{mostPopularDiscussion.title}}</h1>
                <div class="action"> 
                  <router-link :to="{ name: 'discussion', params: {user: mostPopularDiscussion.by, slug: mostPopularDiscussion.slug } }" class="btn btn-discutio-blue">
                    Open discussion
                  </router-link> 
                </div>
                <div class="created">
             
                </div>
                <div class="or">
                    <span>or explore by tags...</span> 
                </div>
                <div class="tags">
                    <div class="_tag" v-for="(item, k) in $store.state.categories" v-if="k <= 8">
                      <router-link class="tag" :to="{ name: 'tag', params: {tag: item.charAt(0).toLowerCase() + item.slice(1) } }">
                        {{item}}
                      </router-link>    
                    </div> 
                    <div style="clear:both;"></div>
                </div>
              </div> 
            
      </div>  
      <div class="container header-tabs">
        <div class="row">
          <div class="col-lg-12">
              <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#trending" @click="loadContent('trending')"> Trending</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#hot" @click="loadContent('hot')">
                      <i class="fa fa-fire" aria-hidden="true"></i> Hot
                    </a> 
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#new" @click="loadContent('new')"> New</a>
                  </li>
              </ul>
          </div>
        </div>
      </div>
      <div class="content">
                <div class="container" v-if="!busy">
                  <div class="row"> 
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
  name: 'home',
  data() {
    return {
      tip: '',
      discussions: [],
      busy: true,
      mostPopularDiscussion: {}
    }
  },
  components: {},
  methods: {
    loadContent: function(type, firstLoad = false)
    {
      this.busy = true;
      this.discussions = [];
      let params = {"tag": "discutio", "limit": 24};

      switch(type)
      {
        case 'new':
          steem.api.getDiscussionsByCreated(params, (err, result) => this.executeContentRequest(err, result, firstLoad));  
          break;
        case 'trending':
          steem.api.getDiscussionsByTrending(params, (err, result) => this.executeContentRequest(err, result, firstLoad));  
          break;
        case 'hot':
          steem.api.getDiscussionsByHot(params, (err, result) => this.executeContentRequest(err, result, firstLoad));  
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

              if(typeof v.json_metadata.type == "undefined" || v.body_length < 90)
              {
                return true;
              }

              if(firstLoad)
              {
                this.mostPopularDiscussion = {
                  'title' : v.json_metadata.title,
                  'desc' : '',
                  'by' : v.author,
                  'price' : parseFloat(v.pending_payout_value.split(" ")[0]).toFixed(2),
                  'img' : (typeof v.json_metadata.image == "undefined" ? "" : v.json_metadata.image[0]),
                  'category' : (v.json_metadata.category.split("-")[1]),
                  'avatar' : v.json_metadata.userImg, 
                  'slug' : v.permlink        
                }
                
                      console.log(this.mostPopularDiscussion);

                firstLoad = false;
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

          if(result.length < 24)
          {
            let limit = 24 - result.length;
 
            steem.api.getDiscussionsByBlog({tag: "discutio", limit: limit}, (err, result) =>
            {
              $.each(result, (i, v) => 
              {     
                v.json_metadata = JSON.parse(v.json_metadata);

                if(typeof v.json_metadata.type == "undefined")
                {
                  return true;
                }

                if(firstLoad)
                {
                  this.mostPopularDiscussion = {
                    'title' : v.json_metadata.title,
                    'desc' : '',
                    'by' : v.author,
                    'price' : parseFloat(v.pending_payout_value.split(" ")[0]).toFixed(2),
                    'img' : (typeof v.json_metadata.image == "undefined" ? "" : v.json_metadata.image[0]),
                    'category' : (v.json_metadata.category.split("-")[1]),
                    'avatar' : v.json_metadata.userImg, 
                    'slug' : v.permlink        
                  }
                  
                  console.log(this.mostPopularDiscussion);
                  
                  firstLoad = false;
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
            });        
          }else{
            this.busy = false;
          }
        }
      }
    }
  },
  mounted()
  {
      this.$store.dispatch('setTopicMode', {mode: false, name: ""});
      $(".navbar").removeClass("img-header");
      $(".navbar").removeClass('navbar-active');

    let items = [
      'A one question...',
      'Did you think about...',
      'What if...',
      'Hang on a second and think...' 
    ];

    this.tip = items[Math.floor(Math.random()*items.length)];

    this.loadContent('trending', true);
  }
}
</script>
<style lang="scss"> 
  a.tag {
    text-transform: lowercase;
    display: inline-block;
  }

  a.tag:first-letter {
    text-transform: uppercase;
  }

          .title.loader {      
            text-align: center;
            margin-bottom: 50px;
            .lds-ring {
                width: 60px;
                height: 60px; 
                div {
                    width: 60px;
                    height: 60px;
                    border: 8px solid #ddd;
                    border-color: #ddd transparent transparent transparent;
                }
            }
        }
</style>
