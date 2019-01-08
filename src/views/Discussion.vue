<template>
<div>
  <div class="navbar-hook">
  </div>
  <div class="topic">
      <modal name="non-directly" height="auto" :scrollable="true"
             style="padding-top:100px;padding-bottom:50px;" v-if="nonDirectly.length">
          <div class="row">
              <div class="col-lg-12 non-directly">
                  <div class="_main-box panel">
                      <div class="main-box">
                          <div class="row">
                              <div class="col-lg-12">
                                  <h2 style="    margin-left: -5px;">
                                      This poll has
                                      <strong>{{nonDirectly.length}}</strong>
                                      non-directly replies
                                  </h2>
                                  <p style="margin-bottom:0;">
                                      <a :href="'https://steemit.com/@'+nonDirectly[0].author"
                                         target="_blank"
                                         title="Show profile">
                                          {{nonDirectly[0].author}}
                                      </a>
                                      and {{nonDirectly.length-1}} other Steemians
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="list">
                      <div class="_main-box" v-for="comment in nonDirectly">
                          <div class="main-box">
                              <div class="row">
                                  <div class="col-lg-12">
                                      <h2 style="font-weight: normal;" v-html="comment.body"></h2>
                                      <div class="details">
                                          <div>
													<span style="font-weight: normal;">
														by {{comment.author}}
														<span class="reward">
															 ${{parseFloat(parseFloat(comment.pending_payout_value.split(" ")[0]).toFixed(2))+parseFloat(parseFloat(comment.total_payout_value.split(" ")[0]).toFixed(2))}}
														</span>
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
      </modal>
    <div class="content page white" style="padding-top:0px;">
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
            <div class="row">
                <div class="offset-1 col-lg-10">
                    <div class="settings-panel" :class="{'map-opened' : !mapOpened}">
                        <span class="btn-action" @click="$modal.show('problem-introduce')">
                            <i class="fas fa-external-link-alt"></i> Background of the Problem
                        </span>
                        <span class="btn-action borders" @click="(mapOpened ? mapOpened = false : mapOpened = true)">
                            <i class="far fa-map"></i> <span v-if="mapOpened"> Hide</span>
                            <span v-else-if="!mapOpened"> Show</span> discussion map
                        </span>
                        <span class="btn-action borders" v-if="!busyReSteem" @click="reBlog">
                            <i class="fa fa-retweet" aria-hidden="true"></i> Resteem
                        </span>
                        <span class="btn-action borders" v-if="busyReSteem">
                            <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>
                        </span>
                        <span class="btn-action borders" @click="$modal.show('non-directly')" v-if="nonDirectly.length">
		                            <i class="fas fa-users"></i> Show non-directly replies
									<span class="count">{{nonDirectly.length}}</span>
		                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" style="position:relative;">
            <div class="row" v-if="mapOpened">
                <div class="col-lg-12">
                    <div style="" class="map">
                        <div class="col-map" v-for="(item, key) in map.left.slice().reverse()">
                            <div class="element" v-for="(_item, _key) in item" v-tooltip="{ content: _item.title.replace(/<(?:.|\n)*?>/gm, '') }"
                            :class="[{'cons': _item.type == 'cons', 'pros': _item.type == 'pros', 'active': _item.active}]"
                            :id="'o-id-left-'+key+'-'+_key">
                            </div>
                        </div>
                        <div class="col-map">
                             <div v-tooltip="{content: map.neutral.title}" class="active element o-id-neutral">
                             </div>
                        </div>  
                        <div class="col-map" v-for="(item, key) in map.right">
                            <div class="element" v-for="(_item, _key) in item" v-tooltip="{ content: _item.title.replace(/<(?:.|\n)*?>/gm, '') }"
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
                                    <h2 v-html="current.desc"></h2>
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
                                        <span @click="changeCurrent(item)" class="comment-title"  v-html="item.desc">
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

                                            <span class="single-option" @click="editComment(item)"
                                                  v-if="$store.state.user && item.author === $store.state.user.name">
                                                 <i class="fas fa-pencil-alt"></i>
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
                                        <span @click="changeCurrent(item)" class="comment-title" v-html="item.desc">
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

                                            <span class="single-option" @click="editComment(item)"
                                                  v-if="$store.state.user && item.author === $store.state.user.name">
                                                 <i class="fas fa-pencil-alt"></i>
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
  <modal name="add-pros-or-cons" @before-open="beforeOpen">
        <div class="add">
            <div class="type" v-if="'new' === commentEditor.mode">
               <h2>You're adding
                   <span @click="('pros' === add.type? add.type = 'cons' : add.type = 'pros')" :class="{'cons': 'cons' === add.type, 'pros': 'pros' === add.type}"> {{('cons' === add.type ? 'Con' : 'Pro')}} <i class="fas fa-sync"></i>
                   </span>
                   as <img v-if="$store.state.user.avatar" :src="$store.state.user.avatar" width=20 class="rounded-circle"/>
                            {{$store.state.user.user}}
               </h2>
            </div>
            <div class="type" v-if="'edit' === commentEditor.mode">
                <h2>You're editing your <span :class="{'cons': 'cons' === add.type, 'pros': 'pros' === add.type}">
                    {{('cons' === add.type ? 'Con' : 'Pro')}}
                    </span>
                    as <img v-if="$store.state.user.avatar" :src="$store.state.user.avatar" width=20 class="rounded-circle"/>
                    {{$store.state.user.user}}
                </h2>
            </div>
            <div>
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
                    <editor-content class="editor__content" :editor="editor" v-model="add.desc" :disabled="busy" />
                </div>
            </div>
                 <div class="submit">
                          <button v-if="!busy" @click="saveComment" class="btn btn-confirm">
                            Save
                          </button>
                          <button v-else-if="busy" class="btn btn-confirm">
                            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                          </button>
                 </div>
        </div>
  </modal>
    <modal name="problem-introduce" height="auto" :scrollable="true" style="padding-top:100px;padding-bottom:50px;">
    <div class="problem-modal">
        <div class="header-img" :style="{ 'background-image': 'url(' + problem.img + ')' }"></div>
        <div class="desc">
            <p v-html="problem.description"></p>
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

    import 'vue-directive-tooltip/css/index.css';
    import "vue-snotify/styles/material.css";
    import "../assets/css/discussionOrPoll.scss";

    Vue.use(Snotify)
    Vue.use(VModal);
    Vue.use(Tooltip);

    export default {
        name: 'discussion',
        methods: {
            beforeOpen (event) {
                this.commentEditor = event.params;
            },
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
            showRewardPanel: function(item)
            {
                item.rewardHover = true; 
            },
            editComment: function(item)
            {
                this.createEditor(item.desc);
                this.add.type = item.type;
                this.$modal.show('add-pros-or-cons', {mode: 'edit', permlink: item.permlink});
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
            reBlog: function()
            {
                if(this.busyReSteem)
                {
                    return;
                }

                this.busyReSteem = true;

                this.$store.state.api.reblog(
                    this.$store.state.user.name,
                    this.problem.author,
                    this.problem.perm,
                    (err, res) => {
                        this.busyReSteem = false;

                        if(err)
                        {
                            this.$snotify.error('Something went wrong, try again for a minute', 'Fail');
                            return;
                        }

                        this.$snotify.success('Topic has reblogged', 'Success');
                    });
            },
            createEditor: function(desc = "")
            {
                this.editor = new Editor({
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
                    content: desc
                })
            },
            addPros: function()
            {
                this.createEditor();
                this.add.type = 'pros';
                this.$modal.show('add-pros-or-cons', {mode: 'new', permlink: ''});
            },
            addCons: function() 
            {
                this.createEditor();
                this.add.type = 'cons'; 
                this.$modal.show('add-pros-or-cons', {mode: 'new', permlink: ''});
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
                let result = this.state.content;
                let username = this.$store.state.user.name;
                let v = [];
                let elementIndex = this.current.author+"/"+this.current.permlink;

                let replies = result[elementIndex].replies;

                let _replies = [];

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

                    if(v == 'undefined' ||  v === undefined)
                    {
                        return true;
                    }

                    console.log(v);

                    if(v.author == 'undefined')
                    {
                        return true;  
                    }

                    let obj = v.json_metadata;

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
            saveComment: function()
            {
                let errors = [];

                if($(".ProseMirror > p").hasClass("is-empty"))
                {
                    errors.push("Without comment content? Type something :)");
                }

                let desc = $(".ProseMirror").html();

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
                    desc: desc,
                    userImg: this.$store.state.user.avatar
                };

                let author = this.$store.state.user.name;
                let perm = "";

                if(this.commentEditor.mode === "new")
                {
                    perm = Math.random().toString(36).substring(2);
                }else{
                    perm = this.commentEditor.permlink;
                }

                let data = {
                    operations: 
                    [   
                        [
                            "comment",
                            {
                                author: author,     
                                body:
                                meta.desc+" <p class='__dfooter'><sub>Posted via <a href='https://discut.io'>Discut.io</a>, debates without censorship!</sub></p>",
                                json_metadata: JSON.stringify(meta),
                                parent_author: this.current.author,  
                                parent_permlink: this.current.permlink,
                                permlink: perm,
                                title: "Reply"
                            }
                        ],
                    ]
                };

                if(this.commentEditor.mode === "new")
                {
                    data.operations.push(
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
                    );
                }

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
                    steem.api.getContent(author, perm, (err, result) =>
                    {

                        if(this.commentEditor.mode === "new")
                        {
                            this.state.content[author+"/"+perm] = result;
                            this.state.content[this.current.url].replies.push(author+"/"+perm);
                            this.state.content[author+"/"+perm].stars = ["blank", "blank", "blank", "blank", "blank"];
                            this.state.content[author+"/"+perm].reward = "0.0";

                            this.getComments(this.current.url, this.current.url);
                        }else{
                            $.each(this.currentComments, (i, v) => {
                                if(v.permlink === this.commentEditor.permlink)
                                {
                                    v.desc = meta.desc;
                                    return false;
                                }
                            })
                        }

                        this.busy = false;

                        this.$snotify.success('Comment has been '+(this.commentEditor.mode === "new" ? 'added' : 'edited'), 'Success!');
                        this.$modal.hide('add-pros-or-cons');
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
                linkUrl: null,
                linkMenuIsActive: false,
                editor: null,
                state: {},
                add: {
                    type: '',
                    desc: ''
                },
                commentEditor: {
                    mode: 'new',
                    permlink: ''
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
                    busyVote: false,
                },
                history: [], 
                currentComments: [],
                busy: false,
                bestReward: 0, //equal 5 stars,
                forOneStar: 0,
                problem: {
                    title: "",
                    description: "",
                    img: "",
                    author: "",
                    perm: ""
                },
                map: {
                    left: [],
                    right: [],
                    neutral: {}
                },
                commentsMap: [],
                mapWay: "-",
                mapOpened: true,
                nonDirectly: [],
                nonDirectlyOpen: false,
                busyReSteem: false
            }
        },
        watch: {},
        components: {
            VModal,
            EditorContent,
            EditorMenuBar,
            EditorMenuBubble,
        },
        mounted() 
        {
            this.$store.dispatch('setMenuStatus', false);

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

                                if(obj.type == 2)
                                {
                                    window.location = '/';
                                    return;
                                }

                                this.problem.title = obj.title;
                                this.problem.description = obj.description;
                                this.problem.url = result.author+"/"+result.permlink;
                                this.problem.img = obj.image[0];
                                this.problem.author = result.author;
                                this.problem.perm = result.permlink;

                                this.$store.dispatch('setTopicMode', {mode: true, name: obj.title, img: obj.image[0]});
                                document.title = "Discut.io - " + obj.title;
                                $(".navbar").removeClass('navbar-active');

                                this.item.result = result;
                                this.item.title = obj.title;
                                this.item.desc = obj.description;
                                this.item.category = obj.category.charAt(0).toUpperCase() + obj.category.slice(1);
                                this.item.url = this.problem.url;
                                this.item.image = obj.image[0];
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
                                let bestRewardWithoutTopic = 0;

                                bestReward = parseFloat(result.pending_payout_value.split(" ")[0]).toFixed(2);

                                this.current.reward = bestReward;
                                this.item.reward = bestReward;

                                steem.api.getState(result.url, (err, _result) =>
                                {
                                    if(!err)
                                    {
                                        $.each(_result.content, (i, v) =>
                                        {
                                            if(v.json_metadata == "") {
                                                delete _result.content[i];
                                                return true;
                                            }

                                            if(typeof v === 'string')
                                            {
                                                return true;
                                            }

                                            let obj = {};

                                            if(v.json_metadata == "") {
                                                obj = {type: ""};
                                            }else{
                                                obj = JSON.parse(v.json_metadata);
                                            }

                                            if(typeof obj.type == 'undefined' || obj.type == "")
                                            {
                                                this.nonDirectly.push(v);
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

                                            if(_result.content[i].reward > bestRewardWithoutTopic)
                                            {
                                                if(this.problem.url === v.author + "/" + v.permlink)
                                                {
                                                    return true;
                                                }

                                                bestRewardWithoutTopic = _result.content[i].reward;
                                            }
                                        });

                                        this.bestReward = bestReward;
                                        this.forOneStar = bestReward/5;

                                        bestRewardWithoutTopic = bestRewardWithoutTopic/5;

                                        console.log(bestReward/5);
                                        console.log(bestRewardWithoutTopic);

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

                                            stringStars = (_result.content[i].reward / bestRewardWithoutTopic).toFixed(1).split(".");

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