<template>
  <div class="tagPage">
    <div class="details">
        <h1>Meet discut.io!</h1>
        <p>
            <a :href="'https://steemit.com/@discutio'" target="_blank">
                <i class="fas fa-external-link-alt"></i> 
                Follow Discut.io on Steemit
            </a>  
        </p>  
        <div class="container"> 
          <div class="row">
            <div class="col-lg-4 offset-4">
              <p class="motto">
                Your opinions are the most expensive. Discover debates and hard subjects without censorship!
              </p>
              <div class="team">— Discut.io Team</div>
            </div>
          </div>
        </div>
    </div>
    <div class="container">
        <div>
            <div class="container">
               <div class="case">
                  <div class="row">
                      <div class="col-lg-4 offset-2">
                        <h4>
                          Earn money with your ideas and opinions!
                        </h4> 
                        <p>
                          If you have hard subject (even taboo), you can earn money for that. 
How? Steem system allows to earn money for upvotes.
                          With <strong>Pros</strong> the matter is a simple - You can earn money with upvotes.
                           But what if You don't like the opinion? You can add <strong>Cons</strong> to this opinion and earn money too. If someone approves your opinion - give to you upvote. 
                          Profit will appears on your Steem account.
                        </p>
                      </div>
                      <div class="col-lg-4">
                        <div class="img">
                            <img src=""/>
                          </div>
                      </div>
                  </div>
                </div>
                <div class="case">
                  <div class="row">
                      <div class="col-lg-4 offset-2">
                        <div class="img">
                            <img src=""/>
                          </div>
                      </div>
                      <div class="col-lg-4">
                        <h4>
                          Without censorship!
                        </h4>
                        <p>
                          Other debate platforms are centralized. We think, that centralization is not a synonymous of freedom or free-speech. So that's way, we've made Discut.io. First decentralized debate platform. 
                        </p>
                      </div>
                  </div>
                </div>
                <div class="case">
                  <div class="row">
                          <div class="col-lg-4 offset-2">
                              <h4>
                                Why Blockchain?
                              </h4>
                              <p>
                                Blockchain is the best place for free-speech. 
      For this reason we've made debate platform on Blockchain.
      Discut.io is does exist thanks community and y'all decide which case is worth of discussion.
      But main reason is simple. Steem Blockchain allows creating debates in which freedom of speech is the most important.
                              </p>
                          </div>
                      <div class="col-lg-4">
                          <div class="img">
                            <img src=""/>
                          </div>
                      </div>
                  </div>
                </div>
            </div>      
        </div>  
      </div>
  </div>
</template>
<script>
export default {
  name: 'meet',
  data() {
    return {
    }
  },
  components: {},
  methods: {
  },
  mounted()
  {  
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
    .motto {
      margin-top: 30px;
      font-style: italic;
      color: #616770;
      font-size: 18px !important;
      &::before {
          display: block;
          position: absolute;
          top: 10px;
          left: 10px;
          content: "\"";
          font-family: 'Bitter', serif;
          font-size: 30px;
          color: #999;
      }
      &::after {
          display: block;
          position: absolute;
          right: 20px;
          bottom: 20px;
          content: "\"";
          font-family: 'Bitter', serif;
          font-size: 30px;
          color: #999;
      }
    }
      .team {
        font-size: 14px;
        font-style: italic;
        color: #616770;
      }

    .case {
      margin-bottom: 30px;
      h4 {
        color: #333;
      }
      p {
        margin-top: 20px;
        color: #616770;
        font-size: 15px;
      }
    }  
</style>