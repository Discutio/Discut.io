<template>
<div>
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <nav class="navbar navbar-expand-md navbar-dark fixed-top"
            :class="{'img-header': $store.getters.isTopic, 'navbar-active' : $store.getters.isMenuActive}"
                 :style="{backgroundImage: 'url('+$store.getters.getTopicImg+')'}">
              <router-link class="navbar-brand" :to="{ name: 'home' }">
                <img src="/lw.png" width=40 />
              </router-link>  <span class="beta">BETA</span>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item" :class="{'active': ('meet' === this.$route.name)}"> 
                    <router-link class="nav-link" :to="{ name: 'meet' }">
                      Meet <span class="sr-only">(current)</span>
                    </router-link>        
                  </li>
                  <li class="nav-item" :class="{'active': ('tags' === this.$route.name)}"> 
                    <router-link class="nav-link" :to="{ name: 'tags' }">
                      Tags
                    </router-link>        
                  </li>
                  <li v-if="false" class="nav-item" :class="{'active': ('search' === this.$route.name)}">
                    <router-link class="nav-link" :to="{ name: 'search' }">
                      <i class="fa fa-search"></i>
                    </router-link> 
                  </li>
                  <li class="nav-item" v-if="$store.getters.isTopic" style="padding-top: 2px;">
                    <span class="topic-name">
                        {{$store.getters.getTopicName}}
                    </span>
                  </li>
                </ul>
                <ul class="navbar-nav mr-auto pull-right navbar-right">
                  <li>
                    <router-link class="right-btn clear" :to="{ name: 'add' }">
                      <i class="fa fa-plus"></i>
                      Add discussion
                    </router-link> 
                  </li> 
                  <li>  
                    <span v-if="!$store.state.steemToken">
                      <a :href="$store.state.authUrl" class="right-btn">
                        <i class="fa fa-external-link"></i>
                        Login 
                      </a>
                    </span>  
                    <span v-if="$store.state.steemToken">
                      <a class="right-btn user" @click="(menuActive?menuActive=false:menuActive=true)">
                        <img v-if="$store.state.user.avatar" :src="$store.state.user.avatar" width=20 class="rounded-circle"/>
                        {{$store.state.user.user}} 
                        <i class="fas" :class="{'fa-caret-down':!menuActive,'fa-caret-up':menuActive}"></i>
                      </a>  
                      <div class="user-menu" v-if="menuActive">     
                        <ul>
                          <li>
                            <div class="slider">   
                              <vue-slider v-model="voteWeight" :tooltip="'hover'" ref="slider"
                              :max="100" :min="1" @drag-end="voteWeightDragEnd()"></vue-slider>
                            </div>     
                            <span class="power">    
                               Vote power @ {{voteWeight}}%
                            </span>
                          </li>  
                          <li>
                            <a class="steem-profile" :href="'https://steemit.com/@' + $store.state.user.user" target="_blank">
                              <img src="/ste.jpg" width=18 /> Profile
                            </a>
                          </li>
                          <li>
                            <a :href="'https://steemit.com/@' + $store.state.user.user + '/settings'" target="_blank">
                              <i class="fas fa-cogs"></i> Settings
                            </a>
                          </li>
                          <li>    
                            <a href="/logout">
                              <i class="fas fa-sign-out-alt"></i> Logout   
                            </a>  
                          </li>
                        </ul>
                      </div> 
                    </span>
                  </li>
                </ul> 
              </div>
            </nav>
          </div>
        </div>  
	 </div>
   <router-view/>  
   <footer>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 social"> 
            <ul>
              <li>
                <a href="https://medium.com/@discutio123" target="_blank">
                  <i class="fab fa-medium"></i> 
                </a>
              </li>
              <li>
                <a href="https://discord.gg/EWKjZt3" target="_blank">
                   <i class="fab fa-discord"></i> 
                </a>
              </li>
              <li style="margin-top:-4px;">
                <a href="https://steemit.com/@discutio" target="_blank">
                   <img src="/ste.jpg" width=35>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/@IoDiscut" target="_blank">
                  <i class="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="https://github.com/Discutio" target="_blank">
                  <i class="fab fa-github"></i> 
                </a>
              </li>
            </ul>  
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 offset-1"> 
            <div class="powered">
              <img src="/logo.png" width="40"> +
              <img src="/steemit.svg" width=20 class="steemit">     
              <div> 
                Powered by Steem Blockchain
              </div>
            </div>
        </div>
        <div class="col-lg-3"> 
            <ul class="menu">
              <li>
                <router-link :to="{ name: 'home'}">
                    Home
                </router-link> 
              </li>
              <li>
                <router-link :to="{ name: 'meet'}">
                    Meet Discut.io
                </router-link> 
              </li>
              <li>
                <router-link :to="{ name: 'tags'}">
                    Tags
                </router-link> 
              </li>
              <li>
                <router-link :to="{ name: 'add'}">
                    Add discussion
                </router-link> 
              </li>
            </ul>  
        </div>
        <div class="col-lg-3"> 
            <ul class="menu">
              <li v-if="!$store.state.steemToken"><a :href="$store.state.authUrl">Login</a></li>
              <li v-if="$store.state.steemToken"><a href="/logout">Logout</a></li>
              <li>
                <router-link :to="{ name: 'meet'}">How can I earn money?</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'meet'}">What is Blockchain Technology?</router-link>
              </li>
            </ul>  
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="copyr">
            2018 - Discut.io
          </div> 
        </div>
      </div>
    </div>
   </footer>
</div>
</template>
<script>
  import vueSlider from 'vue-slider-component';

  export default {
    name: 'app',  
    data() {
      return {
        voteWeight: parseInt(this.$store.state.voteWeight),
        menuActive: false
      } 
    },
    components: { vueSlider }, 
    methods: {
      voteWeightDragEnd()
      {  
        this.$store.commit('setVoteWeight', this.voteWeight);
        this.voteWeight = this.$store.state.voteWeight;
      }  ,
        hookPos()
        {
            let h = 0;
            let hook = $('.navbar-hook');
            let nav = $(".navbar");

            $(window).scroll(() =>
            {
                h = hook.height() - 100;

                if(isNaN(h))
                {
                    return this.$store.dispatch('setMenuStatus', true);
                }

                if($(window).scrollTop() > h)
                {
                    this.$store.dispatch('setMenuStatus', true);
                }else{
                    this.$store.dispatch('setMenuStatus', false);
                }
            })
        }
    },
      created: function () {
          this.hookPos();
      },
      updated: function()
      {

      },
      watch:
          {

          },
      mounted()
      {
          this.hookPos();
      }
  }
</script>
<style lang="scss">
  .img-header {
    background-size: cover;    box-shadow: inset 1px -200px 226px -48px rgba(0, 0, 0, 0.4);
    background-image: url("http://i.huffpost.com/gen/782735/thumbs/o-MICHAEL-BAY-TRANSFORMERS-4-facebook.jpg");
    background-size: cover;
    background-position-y: -100px;
    border-width: 0px !important;
    .nav-link {
      color: #fff !important;
      &:hover {
        color: #eee !important;
      }
    }
    .nav-item.active > a {
      color: #333 !important;
      font-weight: bold !important;
    }
    .right-btn {
      box-shadow: none !important;
      &:hover {
        color:#eee !important;
        border-color:#eee !important;
      }
    }
    .right-btn.user {
      cursor:pointer !important;
    }
    .right-btn.clear {
      color: #fff !important;
      border-color: #fff !important;
    }
  }
  .topic-name {
    color: #fff;
    padding-left: 20px;
    border-left: 2px solid #fff;
    font-size: 13px;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 2px;
  }

.navbar-brand {
    margin-right: 30px !important;
}

.nav-item { 
    margin-right: 20px;
    a {
        color: #fff;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 2px;
        transition: all .2s; 
    }
}      
           
.content {  
    padding-top: 60px;
    background-color: #fbfbfb;
    &.page {
      padding-top: 100px;
      padding-bottom: 34px;
    }
    &.white {
      background-color: #fff;
    }
}

.navbar {
    transition: all .2s;
    border-width: 1px;
    color: transparent; 
    border-color: transparent;
    &.navbar-active {
      background-color: #fff;
      margin: 0;
      transition: all .2s; 
      border-bottom: 1px solid #eee;

      .nav-link {
        color: #616770;
        &:hover {
          color: #333;
        }
      }
      .nav-item.active > a {
        color: #333 !important;
        font-weight: bold;
      }
      .right-btn {
         box-shadow: none !important;
          &:hover {
            color:#333 !important;
            border-color:#333 !important;
          }
      }
      .right-btn.user {
        cursor:pointer;
      }
      .right-btn.clear {
        color: #616770;
        border-color: #616770 !important;
      }

    }
}

.navbar-nav {
    &.navbar-right {
        margin-right: 0!important;
        a.right-btn {
            padding: 10px 15px; 
            font-size: 12px;
            color: #fff;
            background-color: #409805;
            border: 1px solid #409805;
            font-weight: 700;
            box-shadow: 2px 2px 12px 0 rgba(0,0,0,.2);
            transition: all .2s; 
            letter-spacing: 2px;
            margin-right: 20px;
            border-radius: 30px;
            cursor: pointer;
        }
        a.clear {
            background-color: transparent;
            border: 1px solid #fff;
            font-weight: 400;
        }
        a.right-btn:hover {
            text-decoration: none;
            background-color: transparent;
            box-shadow: none;
            -webkit-box-shadow: none;
            color: #fff;
            transition: all .2s;  
            border: 1px solid #fff; 
        }
        a.clear:hover {
            color: #ddd;
            transition: all .2s;   
        }
        .user-menu {
          position: absolute;
          border: 1px solid #ddd;
          background-color:#fff;
          margin-top: 25px;
          border-radius: 5px;
          margin-left: -30px;
          padding: 20px 20px;
          &:before {
            position: absolute;
            content: '';
            width: 14px;
            height: 14px;
            border: 1px solid #ddd;
            background-color: #fff;
            right: 50px;
            margin-top: -27px;
            border-top-color: transparent;
            border-right-color: transparent;
            -webkit-transform: rotate(135deg);
            transform: rotate(135deg);
          }
          .vue-slider-component .vue-slider-process,
          .vue-slider-component .vue-slider-tooltip {
              background-color: #409805;
          }
          .vue-slider-component .vue-slider-tooltip {
            border: #409805;
          }
          ul {
            list-style-type: none;
            padding: 0;
            li {
              margin-bottom: 10px;
              div.slider {
                margin-top: 0px;

              }
              a, span.power { 
                color: #616770;
                font-size: 13px;
                font-weight: bold;  
                i, img {
                  margin-right: 5px;
                }   
                &.steem-profile {
                  color:#06D6A9;
                }
              }
              span.power {
                font-weight: normal;
              }
            }
          }
        }
    } 
} 

.header {
    background-color: #fff;  
    height: 600px;  
    background-size: cover; 
    position: relative;
    .top-thread {
        margin: 0;
        position: absolute;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        text-align: center; 
        width: 100%;
        padding: 0 30%;
        p, h1 { 
            color: #fff;
        }
        p {
            font-size: 12px;
            font-style: italic;
            opacity: 0.6;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 2px;
            transition: all .2s; 
        } 
        h1 {
            text-align: center;
            font-size: 40px;
            font-weight: 700;
            position: relative;
            text-transform: uppercase;
            text-shadow: 0 0 20px rgba(0,0,0,.1);
        }
        .tags {
            line-height: 33px;
            display: inline-block;
            position: relative;
            text-align:center;
            display: flex;
            width: 100%;
            justify-content: center;
            ._tag {
              float: left;
              display:inline-block;
              .tag {
                margin-right: 10px;
              }
            }
        }
        .action {
            margin-top: 40px;
            a {
           
            }  
        }
        .created { 
            margin-top: 15px;
            font-size: 12px;
            font-style: italic;
            font-size: 11px;
            margin-left: -5px;
            transition: all .2s;
            color: #fff;
            img {
                margin-left: 5px;
                width: 20px;
                border-radius: 40px;
                opacity: 1;
            }
        }
        .or {
            font-size: 11px;
            font-style: italic;
            opacity: 0.6;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 2px;
            -webkit-transition: all .2s;
            transition: all .2s;
            margin-top: 50px;
            margin-bottom: 15px;
            span {
                color: #fff;
            
            }
        }
    }
}    
.tag {
  font-weight: 400; 
  font-size: 13px; 
  line-height: 1.3;
  text-decoration: none;
  padding: 2px 10px;
  border: 1px solid;
  border-radius: 16px;
  color: #fff;
  margin-right: 2px;
  -webkit-transition: 0.15s;
  transition: 0.15s;
  &.white {
    background-color: #fff;
    color: #333;
    border-color: #333;  
  }
  &:hover {
    background-color: #fff;
    color: #333;
    border-color: #fff;
    text-decoration:none;
    -webkit-transition: 0.15s;
    transition: 0.15s;
  }
}
.header-tabs {
    margin-top: -38px;
    .nav-tabs {
        border-bottom: 0;
        .nav-item {
            margin-right: 30px;
            &.active {
              font-weight: bold;
              color: #333;
            }
            .nav-link {
                font-size: 13px;
                border: none;
                color: rgba(255,255,255,.55); 
            }
            .nav-link.active {
                background-color: transparent !important;
                border-bottom: 3px solid #fff;
                color: #fff;
            }
        }
    }

}   

.discussion-widget {
    background-size: cover; 
    margin-bottom: 30px;
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    -webkit-transition: 0.15s;
    transition: 0.15s;
    .shadow-inset {
      -webkit-transition: 0.15s;
      transition: 0.15s;
    }
    &:hover {
      h2 {
         color: #bbb !important;
         -webkit-transition: 0.15s;
         transition: 0.15s;
         cursor: pointer;   
      }
      a:hover {
        text-decoration: none;
      }
      .shadow-inset {
        -webkit-box-shadow: inset 1px -200px 226px -48px rgba(0, 0, 0, 1);
         box-shadow: inset 1px -200px 226px -48px rgba(0, 0, 0, 1);
         -webkit-transition: 0.15s;
         transition: 0.15s;    
      } 
      & {
                -webkit-transition: 0.15s;
         transition: 0.15s;
        -webkit-transform:scale(1.02); /* Safari and Chrome */
        -moz-transform:scale(1.02); /* Firefox */
        -ms-transform:scale(1.02); /* IE 9 */
        -o-transform:scale(1.02); /* Opera */
        transform:scale(1.02);
      }
    }
    .shadow-inset {
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }
    .self-img {
      background-size: cover; 
      position: relative;
      width: 100%;
      height: 300px; 
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;    
    }
    .self {
        position: relative;
        padding: 20px;
        p, h2 {
            color: #fff;
        }
        h2 {
            width: 80%;
            font-size: 20px;
        }
        p {
            font-size: 13px;
        }
    } 
    .action {
        margin-top: 40px;
        position: absolute;
        bottom: 20px;
        left: 20px;
        .btn {
          background: transparent;
          border: 1px solid #fff;
          font-weight: 400;
        }
                p, h2 {
            color: #fff;
        }
        h2 {
            width: 80%;
            font-size: 20px;
        }
    }
    .desc {
      color: #616770;
      font-size: 13px;
      font-weight: bold;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      padding: 10px 15px;
      font-size: 12px;
      border: 1px solid #ddd;
      border-top-width: 0px;
      img {
        margin-right: 3px;
        width: 17px;
        border-radius: 40px;
        opacity: 1;
      }
      .pull-right {
        color: #409805;
      }
    }
}

.block-desc {
  h1 {
    color: #333;
    margin-bottom: 10px;
    font-weight: normal;
  }
  p {
    color: #616770;
    font-size: 14px;
     margin-bottom: 30px;
  }
}


/* Global objs */ 

.pull-right {
  float: right;
}

.btn.btn-confirm {
    padding: 10px 15px;
    font-size: 12px;
    color: #fff;
    background-color: #409805;
    border: 1px solid #409805;
    font-weight: 700;
    -webkit-transition: all .2s;
    transition: all .2s;
    letter-spacing: 2px;
    margin-right: 20px;
    border-radius: 30px;
}

.btn.btn-discutio-blue {
    
    background: rgb(21,133,191);
    background: linear-gradient(180deg, rgba(21,133,191,1) 0%, rgba(19,94,134,1) 91%);
    color: #fff;
    letter-spacing: 2px;
    border-radius: 30px;
    font-size: 13px;
    padding: 10px 20px;
    padding-right: 15px;
}

.btn.btn-discutio-blue:hover {
    -webkit-transform: translateY(2px);
    transform: translateY(2px);
    opacity: 0.9;
    -webkit-transition: 0.15s;
    transition: 0.15s;
}  


/*Helpers*/ 

.shadow-inset { 
    background-color: rgba(0, 0 , 0, 0.2);
    width: 100%;
    height: 100%;
    -webkit-box-shadow: inset 1px -200px 226px -48px rgba(0,0,0,0.87);
    -moz-box-shadow: inset 1px -200px 226px -48px rgba(0,0,0,0.87);
    box-shadow: inset 1px -200px 226px -48px rgba(0,0,0,0.87);
    position: absolute;
}

.radius-15 {
    border-radius: 15px;
}

footer {
    border-top: 1px solid #eee;
    padding: 20px 0;
    .social {
      text-align: center;
      margin-bottom: 30px;
      ul {
        list-style-type: none;
        display: inline-block;
        margin: 0;
        padding: 0;
        zoom:1;
        li {
          text-align:center;
          margin-right: 40px;
          float: left;
          &:last-child {
            margin-right: 0;
          }
          a {
            color: #ddd;
            font-size: 30px;
            -webkit-transition: 0.15s;
            transition: 0.15s;
          }
          a:hover {
            color: #616770;
            -webkit-transition: 0.15s;
            transition: 0.15s;
          }
        }
      }
    }
      .powered {
        color: #616770;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        .steemit {
          margin-left: 8px;
        }
      }
      .menu {
        list-style-type: none;
        padding-left: 0;
        a {
          color: #616770;
          -webkit-transition: 0.15s;
          transition: 0.15s;
          font-size: 12px;
        }
      }
      .copyr {
        color: #616770;
        font-size: 12px;
        text-align: center;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 2px;   
        margin-top: 30px;  
      }
}
.vue-tooltip 
{
  font-size: 12px;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 0px;
  margin-top:2px;
  border: 4px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

  .beta {
    background-color:#fff;color:#409805;
    position:absolute;margin-left:25px;font-size:9px;padding:1px 5px;border-radius:20px;margin-top:3px;
  }

</style>
