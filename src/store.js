import Vue from 'vue'
import Vuex from 'vuex'
import sc2 from 'steemconnect'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      steemToken: '',
      api: [],
      authUrl: '',
      user: [],
      voteWeight: 0,
      steemRate: [],
      rewardFund: [],
      globalProperties: [],
      medianHistory: [],
      loaded: false,
      categories: [
        'Education',
        'Technology',
        'Europe',
        'World',
        'Sex',
        'Gun',
        'Drugs',
        'Gender',
        'Politics',
        'Religion',
        'America',
        'Asia',
        'Ethics',
        'Science',
        'Economy',
        'Law',
        'Morality',
        'Culture',
        'Philosophy'
      ],
      isTopic: false,
      topicName: "",
      topicImg: "",
      isMenuActive: false,
      steemDollarPrice: 0.0
  },
  mutations:   
  { 
      initSteemSession(state)
      {
        axios({
          method: 'get',
          url: 'https://api.coinmarketcap.com/v1/ticker/steem-dollars/'
        }).then((response) =>
        {
          state.steemDollarPrice = state.price_usd;
        });

        steem.api.getRewardFund("post", (err, result) => {
          if (!err) {
            state.rewardFund = result;
          }
        });

        steem.api.getDynamicGlobalProperties((err, result) => {
          if (!err) {
            state.globalProperties = result;
          }
        });

        steem.api.getCurrentMedianHistoryPrice((err, result) => {
          if (!err) {
            state.medianHistory = result;
          }
        });

        if(localStorage.getItem('steemToken'))
        {
          state.steemToken = localStorage.getItem('steemToken');
          state.voteWeight = localStorage.getItem('voteWeight');
        }

        state.api = sc2.Initialize({
          app: 'discutio.app',
          callbackURL: 'https://discut.io/login',
          accessToken: this.state.steemToken,
          scope: []
        });

        if(localStorage.getItem('userObject'))
        {
          state.user = JSON.parse(localStorage.getItem('userObject')).user;

          state.loaded = true;
        }else{
          if(state.steemToken)
          {
            state.api.me((err, res) => {
              if(!err)
              {
                  state.user = res;
                  state.user.avatar = "";

                  if (state.user.account.json_metadata != undefined)
                  {
                     let json = JSON.parse(state.user.account.json_metadata);

                     if (json.profile.profile_image != undefined)
                     {
                      state.user.avatar = json.profile.profile_image;
                     }
                  }

                  localStorage.setItem('userObject', JSON.stringify({user: state.user, refresh: new Date().setHours(10)}));
                  state.loaded = true;
              }
            });
          }else{
            state.loaded = true;
          }
        }

        state.authUrl = state.api.getLoginURL();
      },
      setSteemSession(state, token)
      {
        localStorage.setItem('steemToken', token);
        state.steemToken = localStorage.getItem('steemToken');

        if(token == "")
        {
          localStorage.setItem('userObject', "");
        }
      },
      setVoteWeight(state, weight)
      {
        localStorage.setItem('voteWeight', weight);
        state.voteWeight = localStorage.getItem('voteWeight');
      },
      ['SET_TOPIC_MODE'](state, payload) {
          state.isTopic = payload.mode;
          state.topicName = payload.name;
          state.topicImg = payload.img;
      },
      ['SET_MENU_STATUS'](state, status) {
          state.isMenuActive = status;
      }
    },
    actions: {
        setTopicMode (context, payload) {
            context.commit('SET_TOPIC_MODE', payload);
        },
        setMenuStatus (context, status) {
            context.commit('SET_MENU_STATUS', status);
        }
    },
    getters: {
        isTopic: state => {
            return state.isTopic;
        },
        getTopicName: state => {
          return state.topicName;
        },
        getTopicImg: state => {
            return state.topicImg;
        },
        isMenuActive: state => {
            return state.isMenuActive;
        },
        getSteemDollarPrice: state => {
            return state.steemDollarPrice;
        }
    }

})
