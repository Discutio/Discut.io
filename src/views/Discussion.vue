<template>
<div>
  <div class="navbar-hook">
  </div>
  <div class="topic">
    <div class="content page white">
        <div class="container" v-if="item.title">
            <div class="row">
                <div class="offset-2 col-lg-1 img">
                    <img :src="item.image">
                </div>   
                <div class="col-lg-7 title">
                    <h1>{{item.title}}</h1>
                    <span class="background" @click="$modal.show('problem-introduce')">
                        <i class="fas fa-external-link-alt"></i> Background of the Problem
                    </span>
                    <span class="background" @click="(mapOpened ? mapOpened = false : mapOpened = true)">
                        <i class="far fa-map"></i> <span v-if="mapOpened"> Hide</span> 
                        <span v-else-if="!mapOpened"> Show</span> discussion map
                    </span>
                </div>
            </div>
        </div>   
        <div class="container" v-if="!item.title">
            <div class="row">
                <div class="col-lg-12 title loader">
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
        </div> 
    </div>
    <div class="content main" v-if="item.title">
        <div class="container">
            <div class="row" v-if="mapOpened">
                <div class="col-lg-12">
                    <div style="" class="map">
                        <div class="col-map" v-for="(item, key) in map.left.slice().reverse()">
                            <div class="element" v-for="(_item, _key) in item" v-tooltip="{ content: _item.title }"
                            :class="[{'cons': _item.type == 'cons', 'pros': _item.type == 'pros', 'active': _item.active}]"
                            :id="'o-id-left-'+key+'-'+_key">
                            </div>
                        </div>
                        <div class="col-map">
                             <div v-tooltip="{content: map.neutral.title}" class="active element o-id-neutral">
                             </div>
                        </div>  
                        <div class="col-map" v-for="(item, key) in map.right">
                            <div class="element" v-for="(_item, _key) in item" v-tooltip="{ content: _item.title }"
                            :class="['o-id-right-'+key+'-'+_key, {'cons': _item.type == 'cons', 'pros': _item.type == 'pros', 'active': _item.active}]">
                            </div>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-10 offset-1">
                    <div class="row">
                        <div class="col-lg-12"> 
                            <div class="_main-box">
                                <div class="main-box">  
                                    <div class="back" v-if="'origin' !== current.type">
                                        <span @click="historyBack()">
                                            <i class="fas fa-long-arrow-alt-left"></i> Back
                                        </span> 
                                    </div>
                                    <h2>{{current.desc}}</h2>    
                                    <div class="details"> 
                                        <div class="rewardHover" :class="{'active': current.rewardHover}" 
                                        @mouseleave="current.rewardHover = false"> 
                                            <div @click="voteComment(current)">
                                                <i 
                                                :class="{
                                                    'far': (!current.busyVote&&!current.isVoter), 
                                                    'fas': (!current.busyVote&&current.isVoter)||current.busyVote, 
                                                    'fa-star': !current.busyVote,
                                                    'fa-spinner': current.busyVote, 
                                                    'fa-spin': current.busyVote
                                                    }"></i> {{current.isVoter?'-1':'+1'}} Vote
                                            </div>
                                        </div> 
                           
                                        <div>
                                            <span @mouseover="current.rewardHover = true">
                                                <i v-for="star in current.stars"
                                                :class="{
                                                    'fas fa-star': (star === 'full'),
                                                    'far fa-star': (star === 'blank'),
                                                    'fas fa-star-half-alt': (star === 'half'),
                                                    }">
                                                </i>
                                                <span class="reward">${{current.reward}}</span>
                                            </span>

                                            <div class="pull-right">      
                                                <a :href="'https://steemit.com/@' + current.author" target="_blank" title="Show profile">
                                                    <img :src="current.avatar"> 
                                                    {{current.author}}
                                                </a> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="_main-box">
                                <div class="main-box pros">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <h2>
                                                <span v-if="currentComments.length">
                                                    {{Math.floor((prosComments.length/currentComments.length)*100)}}%
                                                </span> 
                                                Pros 
                                            </h2>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="pull-right">
                                                <span @click="addPros()"> 
                                                    <i class="fas fa-plus"></i>
                                                </span>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-for="item in prosComments" class="_main-box">
                                <div class="main-box" :class="{'weight': item.replies.length > 0}">
                                    <div>
                                        <span @click="changeCurrent(item)" class="comment-title">
                                            {{item.desc}}
                                        </span>
                                    </div>
                                    <div class="details"> 
                                        <div class="rewardHover" :class="{active: item.rewardHover}" @mouseleave="item.rewardHover = false">
                                            <div @click="voteComment(item)">
                                                <i 
                                                :class="{
                                                    'far': (!item.busyVote&&!item.isVoter), 
                                                    'fas': (!item.busyVote&&item.isVoter)||item.busyVote, 
                                                    'fa-star': !item.busyVote,
                                                    'fa-spinner': item.busyVote, 
                                                    'fa-spin': item.busyVote
                                                    }"></i> {{item.isVoter?'-1':'+1'}} Vote
                                            </div>
                                        </div> 
                    
                                        <div>
                                            <span @mouseover="showRewardPanel(item)">
                                                <i v-for="star in item.stars"
                                                :class="{
                                                    'fas fa-star': (star === 'full'),
                                                    'far fa-star': (star === 'blank'),
                                                    'fas fa-star-half-alt': (star === 'half'),
                                                    }">
                                                </i>
    
                                                <span class="reward">${{item.reward}}</span>
                                            </span>

                                            <div class="pull-right">      
                                                <a :href="'https://steemit.com/@' + item.author" target="_blank" title="Show profile">
                                                    <img :src="item.avatar"> 
                                                    {{item.author}}
                                                </a> 
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                                <div class="replies" 
                                    v-if="item.replies.length > 0" 
                                    v-tooltip="{ content: item.repliesPros+' pros, '+item.repliesCons+' cons ('+item.repliesWeight+')' }">
                             
                                    <span v-for="(reply, k) in item.replies" v-if="k <= 12" class="reply" 
                                    :class="{'cons': reply.type == 'cons', 'pros': reply.type == 'pros'}">
                                    </span>
                                    <span v-if="item.replies.length > 12" class="reply">
                                        +{{item.replies.length-12}}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="_main-box">
                                <div class="main-box cons">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <h2>
                                                <span v-if="currentComments.length">
                                                    {{Math.floor((consComments.length/currentComments.length)*100)}}%
                                                </span> 
                                                    Cons
                                            </h2>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="pull-right">
                                                <span @click="addCons()"> 
                                                    <i class="fas fa-plus"></i>
                                                </span> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>   
                            <div class="_main-box" v-for="item in consComments">
                                <div class="main-box">
                                    <div>
                                        <span @click="changeCurrent(item)" class="comment-title">
                                            {{item.desc}}
                                        </span>
                                    </div>
                                    <div class="details"> 
                                        <div class="rewardHover" :class="{active: item.rewardHover}" @mouseleave="item.rewardHover = false">
                                            <div @click="voteComment(item)">
                                                <i 
                                                :class="{
                                                    'far': (!item.busyVote&&!item.isVoter), 
                                                    'fas': (!item.busyVote&&item.isVoter)||item.busyVote, 
                                                    'fa-star': !item.busyVote,
                                                    'fa-spinner': item.busyVote, 
                                                    'fa-spin': item.busyVote
                                                    }"></i> {{item.isVoter?'-1':'+1'}} Vote
                                            </div>
                                        </div> 
                        
                                        <div>
                                            <span @mouseover="item.rewardHover = true">
                                                <i v-for="star in item.stars"
                                                :class="{
                                                    'fas fa-star': (star === 'full'),
                                                    'far fa-star': (star === 'blank'),
                                                    'fas fa-star-half-alt': (star === 'half'),
                                                    }">
                                                </i>
                                                <span class="reward">${{item.reward}}</span>
                                            </span>

                                            <div class="pull-right">      
                                                <a :href="'https://steemit.com/@' + item.author" target="_blank" title="Show profile">
                                                    <img :src="item.avatar"> 
                                                    {{item.author}}
                                                </a> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="replies" 
                                    v-if="item.replies.length > 0" 
                                    v-tooltip="{ content: item.repliesPros+' pros, '+item.repliesCons+' cons ('+item.repliesWeight+')' }">
                             
                                    <span v-for="(reply, k) in item.replies" v-if="k <= 12" class="reply" 
                                    :class="{'cons': reply.type == 'cons', 'pros': reply.type == 'pros'}">
                                    </span>
                                    <span v-if="item.replies.length > 12" class="reply">
                                        +{{item.replies.length-12}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <modal name="add-pros-or-cons">
    <div class="add">
        <div class="type">  
           <h2>You're adding 
               <span @click="('pros' === add.type? add.type = 'cons' : add.type = 'pros')" :class="{'cons': 'cons' === add.type, 'pros': 'pros' === add.type}"> {{('cons' === add.type ? 'Cons' : 'Pros')}} <i class="fas fa-sync"></i>
               </span> 
               as <img v-if="$store.state.user.avatar" :src="$store.state.user.avatar" width=20 class="rounded-circle"/>
                        {{$store.state.user.user}} 
           </h2> 
        </div>  
        <div>
            <textarea rows="4" class="form-control" v-model="add.desc" :disabled="busy"></textarea>
        </div>
             <div class="submit">
                      <button v-if="!busy" @click="addComment" class="btn btn-confirm">
                        Add
                      </button>
                      <button v-else-if="busy" class="btn btn-confirm">
                        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                      </button>  
                  </div>
    </div>
  </modal>
  <modal name="problem-introduce" height="auto">
    <div class="problem-modal">
        <div class="header-img" :style="{ 'background-image': 'url(' + current.image + ')' }"></div>
        <div class="desc">
            <p>{{problem.description}}</p>
        </div>
    </div>
  </modal>
  <vue-snotify></vue-snotify>
</div> 
</template>  
<script>
    import VModal from 'vue-js-modal'
    import Vue from 'vue';
    import axios from 'axios';
    import Snotify from 'vue-snotify';
    import Tooltip from 'vue-directive-tooltip';
      
    import 'vue-directive-tooltip/css/index.css';
    import "vue-snotify/styles/material.css";

    Vue.use(Snotify)
    Vue.use(VModal);
    Vue.use(Tooltip);

    export default {
        name: 'discussion',
        methods: {
            showRewardPanel: function(item)
            {
                console.log("s");
                item.rewardHover = true; 
            },
            drawLine: function(column, point, isActive, position)
            {
     
            },   
            voteComment: function(item, currentBox = false)
            {
                if(item.busyVote)
                { 
                    return;
                }

                item.busyVote = true;

                let weight = this.$store.state.voteWeight*100;

                if(item.isVoter)
                {
                    weight = 0; 
                }
        
                this.$store.state.api.vote(
                    this.$store.state.user.name, 
                    item.author, 
                    item.permlink, 
                    weight, 
                (err, res) => {   
                    item.busyVote = false;

                    if(err)
                    {
                        this.$snotify.error('Something went wrong, try again for a minute', 'Fail');
                        return;
                    }

                    if(item.isVoter)
                    {
                        item.isVoter = false;
                        return this.$snotify.success('Vote removed', 'Success!');
                    }
  
                    item.isVoter = true;
                    this.$snotify.success('Vote added', 'Success!');
                });  
            },
            addPros: function()
            {
                this.add.type = 'pros';
                this.$modal.show('add-pros-or-cons');
            },
            addCons: function() 
            { 
                this.add.type = 'cons'; 
                this.$modal.show('add-pros-or-cons');
            },  
            historyBack: function()
            {
                let index = this.history.length-2;  
                this.changeCurrent(this.history[index], true);
  
                this.history.splice(index+1, 1);   
            },
            changeCurrent: function(item, back = false)
            {  
                let lastUrl = this.current.url;

                this.current.desc = item.desc;
                this.current.avatar = item.avatar;
                this.current.author = item.author;
                this.current.reward = item.reward;
                this.current.stars = item.stars;
                this.current.permlink = item.permlink;
                this.current.type = item.type;       
                this.current.parentAuthor = item.parentAuthor;
                this.current.parentPermlink = item.parentPermlink;
                this.current.url = item.url;
                this.current.image = item.image;
                this.current.isVoter = item.isVoter;
 
                this.getComments(item.url, lastUrl, back);  
  
                if(!back)
                {
                    this.history.push(Object.assign({}, this.current));
                } 
            },
            getComments: function(url, oldUrl = "", back = false)
            {
                console.log("getComments Init"); 
                let result = this.state.content;
                let username = this.$store.state.user.name;
                let v = [];
                let elementIndex = this.current.author+"/"+this.current.permlink;

                let replies = result[elementIndex].replies;

                let _replies = [];

                console.log("url: "+url);
                console.log(replies);     

                if(this.problem.url === url)
                {
                  this.mapWay = "-";
                }else{
                    if(this.problem.url === oldUrl)
                    {
                        let type = result[elementIndex].json_metadata.type;

                        this.mapWay = "left"; 

                        if(type === "cons") 
                        {
                            this.mapWay = "right";
                        }
                    }
                }

                let leftIndex = this.map.left.length-1;
                let rightIndex = this.map.right.length-1;

                if(back)
                {
                    let currentUrl = this.current.url;
                    let indexToDelete = null;

                    if(this.mapWay === "left")
                    {
                        $.each(this.map.left, (i, v) =>  
                        {
                            if(v)
                            {
                                $.each(v, (pointKey, pointValue) => 
                                {
                                    if(pointValue.url == currentUrl) 
                                    {
                                        if(typeof this.map.left[(i+2)] != "undefined")
                                        {
                                            indexToDelete = (i+2);
                                        } 
                                        return false;
                                    }
                                });

                                if(indexToDelete != null)
                                {
                                    this.map.left.splice(indexToDelete, 1); 
                                }
                            }
                        });

                    } 
                    
                    if(this.mapWay === "right")
                    {
                        $.each(this.map.right, (i, v) => 
                        {
                            if(v)
                            {
                                $.each(v, (pointKey, pointValue) => 
                                {
                                    if(pointValue.url == currentUrl) 
                                    {
                                        if(typeof this.map.right[(i+2)] != "undefined")
                                        {
                                            indexToDelete = (i+2);
                                        } 
                                        return false;
                                    }
                                });

                                if(indexToDelete != null)
                                {
                                    this.map.right.splice(indexToDelete, 1); 
                                }
                            }
                        });
                    }

                    if(this.mapWay === "-")
                    {
                        this.map.right.splice(1, 1);   
                        this.map.left.splice(1, 1);   
                    }
                }

                let cons = 0;
                let pros = 0;

                let left = [];
                let right = [];

                $.each(replies, (i, v) =>
                { 
                    v = result[v]; 

                    if(v.author == 'undefined')
                    {
                        return true;  
                    }

                    let obj = v.json_metadata

                    console.log(v);
                    console.log(obj);

                    if (typeof obj === 'string' || obj instanceof String)
                    {
                        obj = JSON.parse(obj);   
                    }

                    if(typeof obj.type == 'undefined')
                    {  
                        return true;
                    }  
 
                    let dataToPush = {
                        desc: obj.desc,  
                        type: obj.type,  
                        avatar: obj.userImg,
                        author: v.author,
                        permlink: v.permlink,
                        parentAuthor: v.parent_author,
                        parentPermlink: v.parent_permlink,
                        rewardHover: false,
                        busyVote: false, 
                        isVoter: false,
                        reward: v.reward,
                        stars: v.stars,
                        replies: [],
                        repliesPros: 0,
                        repliesCons: 0,
                        repliesWeight: "",
                        url: v.author + "/" + v.permlink
                    }; 

                    if(v.replies)
                    { 
                        let meta = {};

                        $.each(v.replies, function(_i, _v) 
                        {
                            if(typeof result[_v].json_metadata == 'undefined' )
                            {
                                return true;
                            }
   
                            meta = result[_v].json_metadata;
   
                            if(typeof meta.type == 'undefined')
                            {
                                return true;  
                            }     

                            if(meta.type === "cons")
                            {
                                dataToPush.repliesCons++;
                            }
  
                            if(meta.type === "pros")
                            {
                                dataToPush.repliesPros++;     
                            }

                            dataToPush.replies.push({type: meta.type});                 
                        }); 

                        dataToPush.repliesWeight =
                            Math.floor((dataToPush.repliesPros/(dataToPush.repliesPros+dataToPush.repliesCons))*100) + "%/" +
                            Math.floor((dataToPush.repliesCons/(dataToPush.repliesPros+dataToPush.repliesCons))*100) + "%";  
                    }

                    if(!back)
                    {
                        let mapObj = {
                            title: (obj.type === "pros" ? "Pros" : "Cons") + ": " + obj.desc,
                            url: v.author+"/"+v.permlink,
                            type: (obj.type === "pros" ? "pros" : "cons"),
                            active: false,
                            replies: dataToPush.replies.length
                        };  

                        if(this.mapWay === "-")
                        {
                            if(obj.type === "pros")
                            {
                                left.push(mapObj); 
                            }      

                            if(obj.type === "cons")
                            {
                                right.push(mapObj); 
                            }     
                        }else{
                            if(this.mapWay === "left")
                            {
                                left.push(mapObj);  
                            }

                            if(this.mapWay === "right")
                            {
                                right.push(mapObj); 
                            }     
                        }
                    }
                  
                    for(let i = 0; i < v.active_votes.length; i++)
                    {
                        if(v.active_votes[i].voter === username && v.active_votes[i].percent > 0) 
                        {     
                            dataToPush.isVoter = true;
                            break; 
                        }      
                    }

                    _replies.push(dataToPush);   
                });

                if(!back) 
                {
                    if(this.mapWay === "left" || this.mapWay === "-" )
                    {
                        let index = this.map.left.length-1;
                        let index2 = 0;

                        let pointFrom = '.o-id-';
                        let pointTo = '.o-id-';

                        $.each(this.map.left[index], (i, v) =>
                        {
                            if(v.url == url)
                            {
                                index2 = i;
                                v.active = true;
                                return false;
                            }
                        });

                        if(left.length > 0)
                        { 
                            this.map.left.push(left);
                        }
                    }

                    if(this.mapWay === "right" || this.mapWay === "-" )
                    {
                        let index = this.map.right.length-1;

                        $.each(this.map.right[index], function(i, v)
                        {
                            if(v.url == url)
                            {
                                v.active = true;
                                return false;
                            }
                        });

                        if(right.length > 0)
                        {
                            this.map.right.push(right);
                        }
                    }
                }else{
                    if(this.mapWay === "left")
                    {
                        $.each( this.map.left[this.map.left.length-1], function(i, v)
                        {
                            v.active = false;
                        });
                    }

                    if(this.mapWay === "right")
                    {
                        $.each(this.map.right[this.map.right.length-1], function(i, v)
                        {
                            v.active = false;
                        });
                    } 

                    if(this.mapWay === "-")
                    {
                        $.each(this.map.left[this.map.left.length-1], function(i, v)
                        {
                            v.active = false;
                        });
                        $.each(this.map.right[this.map.right.length-1], function(i, v)
                        {
                            v.active = false;
                        });
                    }
                }
 
                this.currentComments = _replies;
            },
            addComment: function()
            {
                let errors = [];

                if(!this.add.desc)
                {
                    errors.push("Without comment content? Type something :)");
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

                let meta = {
                    type: this.add.type,
                    desc: this.add.desc, 
                    userImg: this.$store.state.user.avatar
                }

                let author = this.$store.state.user.name;
                let perm = Math.random().toString(36).substring(2);

                let data = {  
                    operations: 
                    [   
                        [
                            "comment",
                            {
                                author: author,     
                                body: meta.desc, 
                                json_metadata: JSON.stringify(meta),
                                parent_author: this.current.author,  
                                parent_permlink: this.current.permlink,
                                permlink: perm,
                                title: meta.desc   
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
                                        {account: "discutio", weight: 1000}
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
                        steem.api.getContent(author, perm, (err, result) => 
                        {     
    
                            this.state.content[author+"/"+perm] = result;   
                            this.state.content[this.current.url].replies.push(author+"/"+perm);  
                            this.state.content[author+"/"+perm].stars = ["blank", "blank", "blank", "blank", "blank"];
  
                            this.busy = false; 

                            this.$snotify.success('Comment added', 'Success!'); 
                            this.$modal.hide('add-pros-or-cons');

                            this.getComments(this.current.url, this.current.url);  
                        });
                    });   
                }).catch((error) => {
                    if(error)
                    {      
                        this.$snotify.error(error.response.data.error_description, 'Steem error');
                        this.busy = false; 
                    } 
                });
            },
            createCommentsMap: function(comments)
            {
                let map = [];
            }
        },
        computed: {
            prosComments() {
               return this.currentComments.filter(function(v) {
                    if(v.type==='pros') return v;
                });  
            }, 
            consComments() {
                return this.currentComments.filter(function(v) {
                    if(v.type==='cons') return v;
                });
            }
        },
        data() {
            return {
                state: {},
                add: {
                    type: '',
                    desc: ''
                },
                item: {
                    title : '',
                    desc : '',
                    byImg: '',
                    byName: '',  
                    reward : '',
                    stars: [],
                    img : 'https://proxy.duckduckgo.com/iur/?f=1&image_host=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2Foriginals%2Fbb%2Fc0%2F82%2Fbbc082bc4a74d21c2c33f5616318b407.jpg&u=https://i.pinimg.com/originals/bb/c0/82/bbc082bc4a74d21c2c33f5616318b407.jpg',
                    category : '?',
                    result: []
                },
                current: {
                    desc: '',
                    avatar: '',
                    reward : '',
                    stars: '', 
                    type: 'origin',
                    parent: 0,
                    permlink: '', 
                    author: '',
                    img: '',
                    rewardHover: false,
                    isVoter: false,
                    busyVote: false
                },
                history: [], 
                currentComments: [],
                busy: false,
                bestReward: 0, //equal 5 stars,
                forOneStar: 0,
                problem: {
                    title: "",
                    description: ""
                },
                map: {
                    left: [],
                    right: [],
                    neutral: {}
                },
                commentsMap: [],
                mapWay: "-",
                mapOpened: true
            }
        },
        watch: {}, 
        components: {VModal}, 
        mounted() 
        { 
            $(".navbar").addClass('navbar-active');
            let refresh = setInterval(() =>
            {
                if(this.$store.state.loaded)
                {
                    let user = this.$route.params.user;

                    if(user[0] === "@")
                    {   
                        user =  user.substr(1);
                    }

                    steem.api.getContent(user, this.$route.params.slug, (err, result) => 
                    { 
                        if(!err && result.id > 0)  
                        {
                            if(result.json_metadata)
                            {  
                                let obj = JSON.parse(result.json_metadata);
                                let username = this.$store.state.user.name;
    
                                this.problem.title = obj.title;
                                this.problem.description = obj.description;
                                this.problem.url = result.author+"/"+result.permlink;
     
                                this.item.result = result;
                                this.item.title = obj.title;
                                this.item.desc = obj.description;
                                this.item.category = obj.category.charAt(0).toUpperCase() + obj.category.slice(1);
                                this.item.url = this.problem.url;
                                this.item.image = obj.image;
                                this.item.reward = parseFloat(result.pending_payout_value.split(" ")[0]).toFixed(2);
                                this.item.rewardHover = false;
                                this.item.busyVote = false;
                                this.item.avatar = obj.userImg;
 
                                for(let i = 0; i < result.active_votes.length; i++)
                                {
                                    if(result.active_votes[i].voter === username && result.active_votes[i].percent > 0) 
                                    {     
                                        this.item.isVoter = true;
                                        break; 
                                    }      
                                }  

                                this.current.desc = obj.title;
                                this.current.avatar = '';
                                this.current.author = result.author;
                                this.current.permlink = result.permlink;
                                this.current.url = this.problem.url;
                                this.current.image = obj.image;  
                                this.current.reward = this.item.reward;
                                this.current.rewardHover = false;
                                this.current.busyVote = false;
                                this.current.isVoter = this.item.isVoter;
                                this.current.avatar = obj.userImg;

                                this.map.neutral = {
                                    title: "Main discussion: " + this.item.title,
                                    url: result.author + "/" + result.permlink,
                                    type: "neutral",
                                    active: true
                                };

                                let bestReward = 0;

                                bestReward = parseFloat(result.pending_payout_value.split(" ")[0]).toFixed(2)

                                this.current.reward = bestReward;
                                this.item.reward = bestReward;
 
                                steem.api.getState(result.url, (err, _result) => 
                                { 
                                    if(!err) 
                                    {

                                        $.each(_result.content, (i, v) =>
                                        {
                                            if(typeof v === 'string')
                                            {
                                                return true;
                                            }

                                            let obj = JSON.parse(v.json_metadata);

                                            if(typeof obj.type == 'undefined')
                                            {  
                                                return true;
                                            }  
    
                                            _result.content[i].json_metadata = obj;
    
                                            _result.content[i] = {
                                                ..._result.content[i], 
                                                reward: parseFloat(_result.content[i].pending_payout_value.split(" ")[0]).toFixed(2), 
                                                stars: []
                                            };
                                            
                                            if(_result.content[i].reward > bestReward)
                                            {
                                                bestReward = _result.content[i].reward;
                                            }
                                        });  

                                        this.bestReward = bestReward;
                                        this.forOneStar = bestReward/5;

                                        let currentStars = [];
                                        let stringStars = "";
                                        let starType = "";

                                        $.each(_result.content, (i, v) =>
                                        {
                                            if(typeof v === 'string')
                                            {
                                                return true;
                                            }

                                            currentStars = [];
                                        
                                            stringStars = (_result.content[i].reward / this.forOneStar).toFixed(1).split(".");

                                            for(let star = 0; star < 5; star++)
                                            {
                                                if(stringStars[0] > star)
                                                {
                                                    starType = "full";
                                                }else{
                                                    starType = "blank";   
                                                }

                                                if(stringStars[1] >= 5 && star >= stringStars[0] && currentStars.indexOf("half") === -1) 
                                                {
                                                    starType = "half";   
                                                }

                                                currentStars.push(starType);
                                            }
                                            
                                            _result.content[i].stars = currentStars;
                                        });  

                                        this.state = _result;  

                                        currentStars = [];
                        
                                        stringStars = (this.current.reward / this.forOneStar).toFixed(1).split(".");

                                        for(let star = 0; star < 5; star++)
                                        {
                                            if(stringStars[0] > star)
                                            {
                                                starType = "full";
                                            }else{
                                                starType = "blank";   
                                            }

                                            if(stringStars[1] >= 5 && star >= stringStars[0] && currentStars.indexOf("half") === -1) 
                                            {
                                                starType = "half";   
                                            }

                                            currentStars.push(starType);
                                        }

                                        this.current.stars = currentStars;
                                        this.item.stars = currentStars;
                                        this.item.rewardHover = false;
                                        this.current.rewardHover = false;

                                        this.history.push(Object.assign({}, this.current));

                                        this.getComments(this.current.url, this.current.url);
                                    }
                                }); 

                                return;
                            }
                        }   
               
                        window.location = '/';
                    });  
 
                    clearTimeout(refresh);      
                }
                
            }, 1000);        
        }      
    }
</script> 
<style lang="scss">
    .content.main {
        padding-top: 30px;
    }
    .map {
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        
        -webkit-box-align: center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        
        -webkit-box-pack: center;
        -moz-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        margin-bottom: 30px;
        .col-map {
            float: left;
            margin-right: 20px;
            div.element {
                    color: #616770;
                    font-size: 13px;
                    font-weight: normal;
                    background-color: #fff;
                    border-radius: 20px;
                    padding: 0px 9px;
                    border: 1px solid #ddd;
                    opacity: 0.8;
                    margin-left: -8px;
                    width: 20px;
                    height: 20px;
                    margin-bottom: 5px;
                    cursor: pointer;
                    &.pros {
                        border-bottom:2px solid #149543;
                    }
                    &.cons { 
                        border-bottom:2px solid #e01020;
                    }
            } 
            div.active {
                background-color: #ddd;
            }
        }  
    }
    .map > .col-map:first-child {
        margin-left: -20px;
    } 
    .submit {
        margin-top: 20px;
    }
    .tooltip-arrow {
        display: none;
    }
    .rewardHover {
        position:absolute;
        background-color:rgba(255,255,255,1);
        width:105%;
        padding:10px;
        margin-top:-10px;
        margin-left:-10px;  
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.2s linear;
        cursor:pointer;
        div {
            font-weight: normal;
            .fa-star {   
                color: #efc20f !important;
                opacity: 1 !important;
            }
        }
        &.active {
            visibility: visible;
            opacity: 1;
                z-index: 9999;
            transition: visibility 0s, opacity 0.2s linear;
        }
    }
    .add {
        padding: 20px 20px;
        .type {
            h2 {
                color: #616770;
                font-size: 18px;
                font-weight: 500;
                line-height: 1.2;
            }
            span.pros {
                color: #149543;
            }
            span.cons {
                color: #e01020;
            }
            span { 
                cursor:pointer;
            }
            span > i {
                font-size: 13px;
            }  
        }
    }
    .problem-modal {
        position: relative;
        .header-img {
            width: 100%;
            background-size: cover;
            height: 200px;
        }
        .desc {
            padding: 20px 20px;
            color: #333;
        }
    }
    .topic {
        padding-bottom: 40px;
        .white {

        }
        .img > img {
            width: 80px;
            height: 80px;
            border-radius: 15px;
            object-fit: cover;
        }
        .title {
            padding-left: 25px;
        }
        .background {
            color: #616770;
            font-size: 13px;
            border: 1px solid #616770;
            border-radius: 5px;
            padding: 3px 8px;
            cursor: pointer;
            margin-right: 10px;
        }
        .title > h1 {
            color: #333;
            margin-bottom: 10px;
            font-weight: normal;
            margin-top: -10px;
        
        }
        .title.loader {      
            text-align: center;
            margin-top: 35px;
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
        @keyframes opa {
            100% {
                opacity: 1;
            }
            0% { 
                opacity: 0;
            }
        }
        ._main-box
        {
            margin-bottom: 20px;
            .replies {
                margin-left: 20px;
                margin-top: -15px;
                .reply {
                    color: #616770;
                    font-size: 13px;
                    font-weight: normal;
                    background-color: #fff;
                    border-radius: 20px;
                    padding: 0px 9px;
                    border: 1px solid #ddd;
                    opacity: 0.8;
                    margin-left: -8px;
                    &.pros {
                        border-bottom:2px solid #149543;
                    }
                    &.cons { 
                        border-bottom:2px solid #e01020;
                    }
                }
            }
        }
        .main-box {
            color: #616770;
            font-size: 13px;
            font-weight: normal;
            background-color: #fff;
            border-radius: 5px;
            padding: 20px 25px 20px 25px;
            border: 1px solid #ddd;
            opacity: 0.8;
            &.weight {
                padding-bottom: 30px;
            }
            .comment-title {
                transition: all 1s; 
                position: relative;
                font-size: 18px;
                    margin-left: -3px;
                cursor: pointer;
                &:hover { 
                    transition: all 1s;  
                    color: #333;
                    opacity: 1 !important;
                    &:before {
                        animation: opa 1s forwards;
                        opacity: 1;
                        font-family: "Font Awesome 5 Free";
                        content: "\f35d";
                        font-style: normal;
                        font-weight: 900;
                        text-decoration: inherit;
                        font-size: 18px;
                        padding-right: 0.5em;
                        position: absolute;
                        bottom: -3px;
                        right: -40px;
                        width:30px;
                        height:30px;
                    }     
                }
            }
            .back {
                margin-top:-30px;
                position: absolute;
                cursor: pointer;
                span {
                    padding: 5px 10px;
                    font-size: 12px;
                    color: rgba(97, 103, 112, 0.6);
                    background-color: #fff;
                    border: 1px solid #ddd;
                    font-weight: 700;
                    -webkit-box-shadow: 2px 2px 12px 0 rgba(0, 0, 0, 0.1);
                    box-shadow: 2px 2px 12px 0 rgba(0, 0, 0, 0.1);
                    -webkit-transition: all .2s;
                    transition: all .2s;
                    letter-spacing: 2px;
                    margin-right: 20px;
                    border-radius: 30px;
                }
                span:hover {
                    color: rgba(97, 103, 112, 1);
                    -webkit-transition: all .2s;
                    transition: all .2s;      
                }
            }
            &.pros, &.cons {
                span {
                    font-size: 20px;
                    cursor: pointer;
                }
                .pull-right > span {
                    color: #fff;
                    font-size: 12px;
                    font-weight: normal;
                    padding: 8px 10px;
                    border-radius: 5px;
                }
            }
            &.pros {
                color: #149543;
                .pull-right > span {
                    background-color: #149543;
                }
            }
            &.cons {
                color: #e01020;  
                .pull-right > span {
                    background-color: #e01020;
                }
            }
            h2, h3, h4, h5, h6 {
                font-size: 18px;
                margin: 0;
            }
            h3 {
                font-weight: normal;
                cursor: pointer;
            }
            .details {
                color: #616770;
                font-size: 13px;
                font-weight: bold;
                font-size: 12px;
                margin-top: 10px;
                position: relative;
                a {
                  color: #616770;  
                  &:hover {
                      text-decoration: none;
                  }
                }
                img {
                    margin-right: 0px;
                    width: 17px;
                    border-radius: 40px;
                    opacity: 1;
                }
                .pull-right {
             /*       color: #409805;*/
                    float: right;
                }
                .fas.fa-star, .fa-star-half-alt {
                    color: #efc20f;
                }
                .far.fa-star {
                    opacity: 0.2;
                }
                span.reward {
                    font-size: 12px;
                    font-weight: normal;
                    background-color: #fff;
                    border-radius: 5px;
                    padding: 3px 6px;
                    padding-left: 5px;
                    border: 1px solid #ddd;
                    margin-bottom: 20px;
                    margin-left: 10px;
                    cursor: pointer;
                    &:before {
                        position: absolute;
                        content: '';
                        width: 8px; 
                        height: 8px; 
                        border: 1px solid #ddd;
                        background-color: #fff;
                        margin-left: -9px;
                        margin-top: 5px;
                        border-top-color: transparent;
                        border-right-color: transparent;
                        -webkit-transform: rotate(45deg);
                        -moz-transform: rotate(45deg);
                        -o-transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        transform: rotate(45deg);
                    }
                }
            }
        }
        .main-box:hover {
            
        }
    }
     .demo {
         border:5px double;
         z-index:2;
         display:table;
         border-radius:90px;
         /*pointer-events:none;*/
         color: rgb(200,200,200);
         color: rgba(0,0,0,0.7);
      }
      .demo:hover {
         color:#55f;
      }
            .connection-border-right span {
         left: 1em;
      }
      .connection-border-left span {
         right: 1em;
      }
      .connection-border-top span {
         top: 1em;
      }
      .connection-border-bottom span {
         bottom: 1em;
      }
</style>