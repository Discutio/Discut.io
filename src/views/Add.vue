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
                      <div class="editor">
                          <editor-menu-bar :editor="editor">
                              <div class="menubar" slot-scope="{ commands, isActive }">
                                  <i class="fa fa-strikethrough"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.strike() }"
                                     @click="commands.strike"></i>

                                  <i class="fa fa-underline"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.underline() }"
                                     @click="commands.underline"></i>

                                  <i class="fa fa-code"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.code() }"
                                     @click="commands.code"></i>

                                  <i class="fa fa-paragraph"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.paragraph() }"
                                     @click="commands.paragraph"></i>

                                  <i class="fa fa-list-ul"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.bullet_list() }"
                                     @click="commands.bullet_list"></i>

                                  <i class="fa fa-list-ol"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.ordered_list() }"
                                     @click="commands.ordered_list"></i>

                                  <i class="fa fa-quote-right"
                                     aria-hidden="true"
                                     :class="{ 'is-active': isActive.blockquote() }"
                                     @click="commands.blockquote"></i>

                                  <i class="fa fa-undo"
                                     aria-hidden="true"
                                     @click="commands.undo"></i>

                                  <i class="fa fa-redo"
                                     aria-hidden="true"
                                     @click="commands.redo"></i>
                              </div>
                          </editor-menu-bar>
                          <editor-menu-bubble class="menububble" :editor="editor">
                              <div
                                      slot-scope="{ commands, isActive, getMarkAttrs, menu }"
                                      class="menububble"
                                      :class="{ 'is-active': menu.isActive }"
                                      :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
                              >

                                  <form class="menububble__form" v-if="linkMenuIsActive" @submit.prevent="setLinkUrl(commands.link, linkUrl)">
                                      <input class="menububble__input" type="text" v-model="linkUrl" placeholder="https://" ref="linkInput" @keydown.esc="hideLinkMenu"/>
                                      <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
                                          <i class="fa fa-times"></i>
                                      </button>
                                  </form>

                                  <template v-else>
                                      <button
                                              class="menububble__button"
                                              @click="showLinkMenu(getMarkAttrs('link'))"
                                              :class="{ 'is-active': isActive.link() }"
                                      >
                                          <span>Add Link</span>
                                          <i class="fa fa-link"></i>
                                      </button>
                                  </template>

                              </div>
                          </editor-menu-bubble>
                          <editor-content class="editor__content" :editor="editor" />
                      </div>
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
                 <p>Your discussion preview:
                 </p>
                 <div class="row">
                    <div class="col-lg-9">
                        <div class="discussion-widget">
                          <div class="self-img" :style="{ backgroundImage: 'url(' + item.img + ')' }">
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

import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    Placeholder
} from 'tiptap-extensions'


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
    components: {
        EditorContent,
        EditorMenuBar,
        EditorMenuBubble,
    },
      data() {
        return {
            linkUrl: null,
            linkMenuIsActive: false,
            editor: new Editor({
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3] }),
                    new ListItem(),
                    new OrderedList(),
                    new TodoItem(),
                    new TodoList(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Link(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new Placeholder({
                        emptyClass: 'is-empty',
                        emptyNodeText: 'Write something…',
                    }),
                ],
            }),
          busy: false,
          default: {
              title : 'I want a start discussion about...',
              desc : 'Something about my topic',
              img : 'https://discut.io/default.png',
              category : '-',
          },
          item: {
              title : 'I want a start discussion about...',
              desc : 'Something about my topic',
              price : '21.37',
              img : 'https://discut.io/default.png',
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
          }
      },
      methods:
      {
          showLinkMenu(attrs) {
              this.linkUrl = attrs.href
              this.linkMenuIsActive = true
              this.$nextTick(() => {
                  this.$refs.linkInput.focus()
              })
          },
          hideLinkMenu() {
              this.linkUrl = null
              this.linkMenuIsActive = false
          },
          setLinkUrl(command, url) {
              command({ href: url })
              this.hideLinkMenu()
              this.editor.focus()
          },
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

            if($(".ProseMirror > p").hasClass("is-empty"))
            {
                errors.push("You have to type description");
            }

            let desc = $(".ProseMirror").html();

          if(!this.$store.state.user.name)
          {
              errors.push("Try again for a 5 seconds");
          }

          if(this.item.title == this.default.title)
          {
              errors.push("You have to type title");
          }

          if(this.item.title.length > 254)
          {
              errors.push("Limit for title: 254 chars");
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
          let body = "<html><h1>Background</h1>"+desc+" <br/><br/> <center><img src='"+this.item.img+"'><br/><br/><a href='https://discut.io/topic/@"+author+"/"+perm+"'>View discussion on Discut.io</a></center></html>";
          let category = this.item.category.charAt(0).toLowerCase() + this.item.category.slice(1);
          let lang = this.item.lang.charAt(0).toLowerCase() + this.item.lang.slice(1);

          let meta = {
              'title': this.item.title,
              'description': desc,
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
             'app':"discutio/0.3",
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
      this.$store.dispatch('setTopicMode', {mode: false, name: ""});
      this.$store.dispatch('setMenuStatus', true);
  }
}
</script>
<style lang="scss">
    .editor {
        margin: 10px 0;
        .menubar {
            text-align: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            i {
                margin-right: 10px;
            }
        }
        .editor__content {
            padding-top: 5px;
            border-bottom: 1px solid #ddd;
        }
    }
    .ProseMirror {
        height: 300px;
        overflow-y: scroll;
        p {
            color: #616770;
        }
    }
    .ProseMirror-focused {
        outline: 0;
    }
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
    .editor p.is-empty:first-child::before {
        content: attr(data-empty-text);
        float: left;
        color: #aaa;
        pointer-events: none;
        height: 0;
        font-style: italic;
    }
    .menububble.is-active {
        opacity: 1;
        visibility: visible;
    }
    .menububble {
        position: absolute;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        z-index: 20;
        background: #000;
        border-radius: 5px;
        padding: .3rem;
        margin-bottom: .5rem;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        visibility: hidden;
        opacity: 0;
        -webkit-transition: opacity .2s,visibility .2s;
        transition: opacity .2s,visibility .2s;
    }
    .menububble__button:last-child {
        margin-right: 0;
    }
    .menububble__button {
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        background: rgba(0,0,0,0);
        border: 0;
        color: #fff;
        padding: .2rem .5rem;
        margin-right: .2rem;
        border-radius: 3px;
        cursor: pointer;
    }
    .menububble__input {
        font: inherit;
        border: none;
        background: rgba(0,0,0,0);
        color: #fff;
    }
</style>
