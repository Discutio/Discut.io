<template>
<div>
  <div class="navbar-hook">
  </div>
  <div class="content page white">
      <div class="container">
          <div class="row" v-if="$store.state.steemToken">
              <div class="col-lg-5 offset-1">
                  <div class="form-group">
                    <label for="usr">Title</label>
                    <input type="text" class="form-control" :disabled="busy" v-model="item.title">
                  </div>
                  <div class="form-group">
                    <label for="usr">Background</label>
                    <textarea class="form-control" :disabled="busy" rows=15 v-model="item.desc"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="usr">URL to image</label>
                     <input type="text" :disabled="busy" class="form-control" v-model="item.img">
                  </div>
                  <div class="form-group">
                    <label for="usr">Category</label>
                    <input type="text" :disabled="busy" class="form-control" v-model="item.category">
                  </div>
                  <div> 
                    <span class="tip">Type your category or choose something from these:</span>
                    <div class="tags">
                      <span class="tag white" v-for="item in $store.state.categories" @click="changeCategory(item)">
                        {{item}}
                        </span>  
                       
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="usr">Language (optional, default English)</label>
                    <input type="text" :disabled="busy" v-model="item.lang" class="form-control" id="">
                  </div>
                  <div> 
                    <span class="tip">Type your language or choose something from these:</span>
                    <div class="tags"> 
                      <span class="tag white" v-for="item in langs" @click="changeLang(item)">
                        {{item}}
                        </span>  
                       
                    </div>
                  </div>
                  <div class="submit">
                      <button v-if="!busy" @click="insertDiscussion" class="btn btn-confirm">
                        Create discussion!
                      </button>
                      <button v-else-if="busy" class="btn btn-confirm">
                        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                      </button>  
                  </div>
              </div> 
              <div class="col-lg-1">
                  <div style="    display: flex;
    width: 100%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;">
                  <div style="border-left: 1px solid #ddd;width:1px;height:70%;  overflow: auto;
  margin: auto;
  position: absolute;opacity: 0.4;top:15%;"></div>
                  </div>
              </div>
              <div class="col-lg-4 block-desc">
                 <h1>Create new discussion</h1>
                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu eleifend risus. Fusce eu convallis quam, et consequat tel.
                 </p>
                 <div class="row">
                    <div class="col-lg-9">
                        <div class="discussion-widget">
                          <div class="self-img"  :style="{ backgroundImage: 'url(' + item.img + ')' }">
                            <div class="shadow-inset"></div>
                            <div class="self">
                              <a href="#" class="tag">{{item.category}}</a>
                            </div>
                            <div class="action">
                              <h2>{{item.title}}</h2> 
                            </div>
                          </div>
                          <div class="desc"> 
                             <img :src="this.$store.state.user.avatar"> 
                            {{this.$store.state.user.user}}

                            <div class="pull-right">
                              ${{item.price}}
                            </div>
                          </div>
                        </div>       
                      </div>
                 </div>
              </div>
          </div>
          <div class="row" v-if="!$store.state.steemToken">
            <div class="col-lg-4 offset-4 notFound">
                <h3>For first You have to <a href="https://signup.steemit.com/" target="_blank">create account</a> or <a :href="$store.state.authUrl">login</a> 😎
                  </h3>
            </div> 
          </div>
      </div>   
  </div>
  <vue-snotify></vue-snotify>
</div>
</template>
<script>
import Vue from 'vue' 
import axios from 'axios'
import Snotify from 'vue-snotify';

import "vue-snotify/styles/material.css";

Vue.use(Snotify)

async function getPhotoSize(url)  
{    
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
} 

export default {
  name: 'add',  
  data() {
    return {
      busy: false,
      default: {
          title : 'I want a start discussion about...',
          desc : 'Something about my topic',
          img : 'https://proxy.duckduckgo.com/iur/?f=1&image_host=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2Foriginals%2Fbb%2Fc0%2F82%2Fbbc082bc4a74d21c2c33f5616318b407.jpg&u=https://i.pinimg.com/originals/bb/c0/82/bbc082bc4a74d21c2c33f5616318b407.jpg',
          category : '-',
      },
      item: {
          title : 'I want a start discussion about...',
          desc : 'Something about my topic',
          price : '21.37',
          img : 'https://proxy.duckduckgo.com/iur/?f=1&image_host=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2Foriginals%2Fbb%2Fc0%2F82%2Fbbc082bc4a74d21c2c33f5616318b407.jpg&u=https://i.pinimg.com/originals/bb/c0/82/bbc082bc4a74d21c2c33f5616318b407.jpg',
          category : '-',
          lang: 'English'
        } ,
      langs: [
          'English',
          'Dutch',
          'Korean',  
          'Turkish',
          'Polish',
          'Russian',
          'Japanese',
          'German',
          'Chinese',
          'Latin',
          'French',
          'Italian',
          'Spanish',
          'Catalan',
          'Arabic',
          'Swedish',
      ]
    }
  },
  watch: {
      'item.category': function(v)
      {
        this.item.category =  v.charAt(0).toUpperCase() + v.slice(1);
      },
      'item.title': function(v)
      {
        this.item.title =  v.charAt(0).toUpperCase() + v.slice(1);
      },      
      'item.desc': function(v)
      {
        this.item.desc =  v.charAt(0).toUpperCase() + v.slice(1);
      }
  },
  methods: 
  { 
    changeCategory: function(item)
    {
      if(this.busy)
      {
        return;
      }

      this.item.category = item;
    },
    changeLang: function(item)
    { 
      if(this.busy)
      {
        return;
      }

      this.item.lang = item;
    }, 
    insertDiscussion: function()
    {
      let errors = [];

      if(!this.$store.state.user.name) 
      {
          errors.push("Try for a 5 seconds");
      }  
 
      if(this.item.title == this.default.title)
      { 
          errors.push("You have to type title");
      }

      if(this.item.desc == this.default.desc)
      {
         errors.push("You have to type description");   
      }

      if(this.item.img == this.default.img)
      {
         errors.push("You have to insert image");      
      }else{

      }

      if(this.item.category == this.default.category || this.item.category == "")
      {
         errors.push("You have to choose category");      
      }

      if(this.item.lang) 
      {
        
      }

      if(errors.length>0)
      { 
        let html = '<ul>';

        for(let i = 0; i < errors.length; i++)
        {
          html += '<li>' + errors[i] + '</li>';
        }

        html += '</ul>';

        this.$snotify.html('<div class="snotifyToast__title">Uppss... errors</div> <div class="snotifyToast__body"> '+html+' <div class="snotify-icon snotify-icon--error"></div>', { timeout: 4000, type: 'error' } );
        return;
      }

      this.busy = true;

      let perm = this.item.title;
      perm = perm.replace(/ /g, '-').toLowerCase().replace(/[^a-z\-]/g,'');
   
      let author = this.$store.state.user.name;
      let body = "<html><h1>Background</h1>"+this.item.desc+" <br/><br/> <center><img src='"+this.item.img+"'><br/><br/><a href='https://discut.io/topic/@"+author+"/"+perm+"'>View discussion on Discut.io</a></center></html>";
      let category = this.item.category.charAt(0).toLowerCase() + this.item.category.slice(1);
      let lang = this.item.lang.charAt(0).toLowerCase() + this.item.lang.slice(1);      

      let meta = {
          'title': this.item.title,
          'description': this.item.desc,   
          'type': 1,
          'language': 'discutio-' + lang, 
          'category': 'discutio-' + category,    
          'userImg': this.$store.state.user.avatar,
          'imgs': {'thumb': '','header': '','big': ''},  
          'tags': [  
            'discutio',
            category,    
            'discutio-' + category,
            'discutio-' + lang, 
          ],  
         'image':[this.item.img],
         'app':"discutio/0.2",
      };
   
      let data = {  
        operations: 
          [   
            [
              "comment",
              {
                author: author,     
                body: body, 
                json_metadata: JSON.stringify(meta),
                parent_author: "",   
                parent_permlink: "discutio",
                permlink: perm,
                title: this.item.title
              } 
            ],
            [
              "comment_options",
              {
                allow_curation_rewards: true,
                allow_votes: true,
                author: author, 
                max_accepted_payout: "1000000.000 SBD",
                percent_steem_dollars: 10000,
                permlink: perm,
                extensions: [
                  [
                    0,
                    {
                      beneficiaries: [   
                        {account: "discutio", weight: 2000}
                      ]
                    }
                  ]
                ]
              }  
            ]
          ]
      };

      axios({
        method: 'post', 
        url: 'https://steemconnect.com/api/broadcast',
        data: data,
        headers: {
          'Authorization': this.$store.state.steemToken,
          'content-type': 'application/json'
        }  
      }).then((response) =>   
      { 
        this.$store.state.api.vote(author, author, perm, this.$store.state.voteWeight*100, (err, res) => 
        {   
          this.$snotify.success('Your discussion has been created', 'Success!');
          this.busy = false;
          this.$router.push('/topic/'+author+'/'+perm);
        }); 
              
      }).catch((error) => {
        if(error)
        {           
          this.$snotify.error(error.response.data.error_description, 'Steem error');
          this.busy = false; 
        } 
      });   
    }
  },
  mounted() {
    $(".navbar").addClass('navbar-active');
  }
}
</script>
<style lang="scss">
  .tip {
    color: #616770;
    font-size: 14px;
  }
  .tags {
    line-height: 30px;
    margin-bottom: 20px;
    margin-top: 10px;
    .tag {
      margin-right: 5px;
      cursor: pointer;
    }
  }
          .notFound {
            text-align:center;
            color: #333;
            margin-bottom: 0px;
        }
</style>
