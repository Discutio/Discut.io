<template>
	<div>
		<div class="navbar-hook">
		</div>
		<div class="topic">
			<modal name="non-directly" height="auto" :scrollable="true"
			       style="padding-top:100px;padding-bottom:50px;" v-if="nonDirectlyComments.length">
				<div class="row">
					<div class="col-lg-12 non-directly">
						<div class="_main-box panel">
							<div class="main-box">
								<div class="row">
									<div class="col-lg-12">
										<h2 style="    margin-left: -5px;">
											This poll has
											<strong>{{nonDirectlyComments.length}}</strong>
											non-directly replies
										</h2>
										<p style="margin-bottom:0;">
											<a :href="'https://steemit.com/@'+nonDirectlyComments[0].author"
											   target="_blank"
											   title="Show profile">
												{{nonDirectlyComments[0].author}}
											</a>
											and {{nonDirectlyComments.length-1}} other Steemians
										</p>
									</div>
								</div>
							</div>
						</div>
						<div class="list">
							<div class="_main-box" v-for="comment in nonDirectlyComments">
								<div class="main-box">
									<div class="row">
										<div class="col-lg-12">
											<h2 style="font-weight: normal;" v-html="comment.body"></h2>
											<div class="details">
												<div>
													<span style="font-weight: normal;">
														by {{comment.author}}
														<span class="reward">
															${{calculateReward(comment)}}
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
				<div class="container" v-if="busy">
					<div class="row">
						<div class="col-lg-12 title loader">
							<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
						</div>
					</div>
				</div>
			</div>
			<div class="content main" v-if="!busy">
				<div class="container">
					<div class="row">
						<div class="offset-1 col-lg-10">
							<div class="settings-panel" :class="{'map-opened' : !menu.mapOpened}">
		                        <span class="btn-action" @click="$modal.show('problem-introduce')">
		                            <i class="fas fa-external-link-alt"></i> Background of the Problem
		                        </span>
								<span class="btn-action borders" @click="(menu.mapOpened ? menu.mapOpened = false : menu.mapOpened = true)">
		                            <i class="far fa-map"></i> <span v-if="menu.mapOpened"> Hide</span>
		                            <span v-else-if="!menu.mapOpened"> Show</span> poll map
		                        </span>
								<span class="btn-action borders" v-if="!menu.busyReSteem" @click="reBlog">
		                            <i class="fa fa-retweet" aria-hidden="true"></i> Resteem
		                        </span>
								<span class="btn-action borders" v-if="menu.busyReSteem">
		                            <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>
		                        </span>
								<span class="btn-action borders" @click="$modal.show('non-directly')" v-if="nonDirectlyComments.length">
		                            <i class="fas fa-users"></i> Show non-directly replies
									<span class="count">{{nonDirectlyComments.length}}</span>
		                        </span>
							</div>
						</div>
					</div>
				</div>
				<div class="container" style="position:relative;">
					<div class="row" v-if="menu.mapOpened">
						<div class="col-lg-12">
							<div style="" class="map" v-if="'start' !== currentItem.systemType">
								<div class="col-map" v-for="(item, key) in map.left.slice().reverse()">
									<div class="element" v-for="(_item, _key) in item"
									     v-tooltip="{ content: _item.title.replace(/<(?:.|\n)*?>/gm, '') }"
									     :class="[{'cons': _item.type == 'cons', 'pros': _item.type == 'pros', 'active': _item.active}]"
									     :id="'o-id-left-'+key+'-'+_key">
									</div>
								</div>
								<div class="col-map">
									<div v-tooltip="{content: 'Current: ' + currentPollElement.title}"
									     class="active element o-id-neutral-q">
									</div>
									<div v-tooltip="{content: 'Poll: ' + problem.title}"
									     class="element o-id-neutral o-id-neutral-m">
									</div>
								</div>
								<div class="col-map" v-for="(item, key) in map.right">
									<div class="element" v-for="(_item, _key) in item"
									     v-tooltip="{ content: _item.title.replace(/<(?:.|\n)*?>/gm, '') }"
									     :class="['o-id-right-'+key+'-'+_key, {'cons': _item.type == 'cons', 'pros': _item.type == 'pros', 'active': _item.active}]">
									</div>
								</div>
								<div style="clear:both;"></div>
							</div>
							<div class="poll-map" v-if="'start' === currentItem.systemType">
								<div style="" class="map">
									<div class="col-map">
										<div v-tooltip="{content: 'Poll: ' + problem.title}"
										     class="active element o-id-neutral">
										</div>
									</div>
								</div>
								<div class="map">
									<div style="clear:both;"></div>
									<div class="col-map">
										<div class="element" v-for="(_item, _key) in pollElementsSorted"
										     v-tooltip="{ content: _item.title }" :class="['o-id-horizontal-'+_key]">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-10 offset-1">
							<div class="row">
								<div class="col-lg-12 non-directly">
									<div class="_main-box"
									     :class="{'panel': 'start' === currentItem.systemType}">
										<div class="main-box">
											<div class="back" v-if="'start' !== currentItem.systemType">
		                                        <span @click="changeCurrentItem(currentItem, true)">
		                                            <i class="fas fa-long-arrow-alt-left"></i> Back
		                                        </span>
											</div>
											<h2
													v-html="currentItem.title"
													v-if="
														'pollElement' === currentItem.systemType ||
														'start' === currentItem.systemType
													">
											</h2>
											<h2
													v-html="currentItem.json_metadata.desc"
											        v-if="'commentElement' === currentItem.systemType">
											</h2>
											<div class="details">
												<div class="rewardHover" :class="{'active': currentItem.rewardHover}"
												     @mouseleave="currentItem.rewardHover = false">
													<div @click="voteComment(current)">
														<i
																:class="{
                                                    'far': (!currentItem.busyVote&&!currentItem.isVoter),
                                                    'fas': (!currentItem.busyVote&&currentItem.isVoter)||currentItem.busyVote,
                                                    'fa-star': !currentItem.busyVote,
                                                    'fa-spinner': currentItem.busyVote,
                                                    'fa-spin': currentItem.busyVote
                                                    }"></i>
														{{
															currentItem.isVoter ?
															('pollElement' === currentItem.systemType?' You have already voted':'-1') :
                                                                '+1 Vote'
														}}
													</div>
												</div>

												<div>
		                                            <span @mouseover="currentItem.rewardHover = true">
		                                                <i v-for="star in currentItem.stars"
		                                                   :class="{
		                                                    'fas fa-star': (star === 'full'),
		                                                    'far fa-star': (star === 'blank'),
		                                                    'fas fa-star-half-alt': (star === 'half')
		                                                    }">
		                                                </i>
			                                            <span class="reward" v-if="currentItem.systemType !== 'pollElement'">
			                                                ${{currentItem.reward}}
		                                                </span>
			                                            <span class="reward"
			                                                  v-if="currentItem.systemType === 'pollElement'">
			                                                {{currentItem.votesCount}} votes
				                                            ({{currentItem.percentageDomination}}%)
		                                                </span>
		                                            </span>
													<div class="pull-right">
														<a :href="'https://steemit.com/@' + currentItem.author" target="_blank" title="Show profile">
															<img :src="currentItem.avatar">
															{{currentItem.author}}
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="list" v-if="'start' === currentItem.systemType">
										<div class="_main-box">
											<div class="main-box">
												<div class="row">
													<div class="col-lg-12">
														<div v-if="pollVotes.length">
															<div class="poll-stats">
																<div v-for="(item, i) in pollElementsSorted"
																     v-if="item.votesCount>0"
																     :style="{'width':item.percentageDomination+'%'}"
																     :class="{'first':0==i,'second':1==i,'third':2==i}">
																	<i class="fas fa-medal" v-if="0==i"></i>
																	{{item.title}}
																	({{item.percentageDomination}}%)
																</div>
															</div>
															<div class="poll-stats-icons">
																<div class="element" v-for="(item, i) in pollElementsSorted">
																	<div class="color " :class="{'first':0==i,'second':1==i,'third':2==i}"></div>
																	<span class="name">
																		{{item.title}}
																		({{item.percentageDomination}}%)
																	</span>
																</div>
															</div>
														</div>
														<div v-if="!pollVotes.length">
															<div class="poll-stats">
																<div :style="{ 'width':'100%'}">
																	0 votes
																</div>
															</div>
															<div class="poll-stats-icons">
																<div class="element">
																	<div class="color"></div>
																	<span class="name">No any votes yet / Nobody
																	                   voted yet</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="row"
							     v-if="currentItem.systemType == 'commentElement' || currentItem.systemType == 'pollElement'">
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
		                                        <span
				                                        @click="changeCurrentItem(item)"
				                                        class="comment-title"
				                                        v-html="item.json_metadata.desc">
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
										     v-if="item.systemReplies.length > 0"
										     v-tooltip="{ content:
										     item.repliesPros+' pros, '+item.repliesCons+' cons ('+(item.repliesPros/item.systemReplies.length)*100+'%/'+(item.repliesCons/item.systemReplies.length)*100+'%)' }">

                                    <span v-for="(reply, k) in item.systemReplies" v-if="k <= 12" class="reply"
                                          :class="{'cons': reply.type == 'cons', 'pros': reply.type == 'pros'}">
                                    </span>
											<span v-if="item.systemReplies.length > 12" class="reply with-content">
                                        +{{item.systemReplies.length-12}}
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
		                                        <span
				                                        @click="changeCurrentItem(item)"
				                                        class="comment-title"
				                                        v-html="item.json_metadata.desc">
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
										     v-if="item.systemReplies.length > 0"
										     v-tooltip="{ content:
										     item.repliesPros+' pros, '+item.repliesCons+' cons ('+(item.repliesPros/item.systemReplies.length)*100+'%/'+(item.repliesCons/item.systemReplies.length)*100+'%)' }">

		                                    <span v-for="(reply, k) in item.systemReplies" v-if="k <= 12" class="reply"
		                                          :class="{'cons': reply.type == 'cons', 'pros': reply.type == 'pros'}">
		                                    </span>
											<span v-if="item.systemReplies.length > 12" class="reply with-content">
		                                        +{{item.systemReplies.length-12}}
		                                    </span>
										</div>
									</div>
								</div>
							</div>
							<div class="row" v-if="currentItem.systemType == 'start'">
								<div class="col-lg-12">
									<div v-for="(item, i) in pollElementsSorted" class="_main-box">
										<div class="main-box" :class="{'first':0==i,'second':1==i,'third':2==i}">
											<div>
		                                        <span @click="changeCurrentItem(item)" class="comment-title">
		                                              <strong><span class="pos">{{(i+1)}}.</span> {{item.title}}</strong>
		                                        </span>
												<div>
		                                            <span @click="changeCurrentItem(item)" class="comment-title">
		                                                <span v-html="item.desc"></span>
		                                            </span>
												</div>
											</div>
											<div>
												<div class="poll"></div>
											</div>
											<div class="details">
												<div class="rewardHover" :class="{active: item.rewardHover}" @mouseleave="item.rewardHover = false">
													<div @click="voteComment(item)">
														<i :class="{
		                                                    'far': (!item.busyVote&&!item.isVoter),
		                                                    'fas': (!item.busyVote&&item.isVoter)||item.busyVote,
		                                                    'fa-star': !item.busyVote,
		                                                    'fa-spinner': item.busyVote,
		                                                    'fa-spin': item.busyVote
		                                                    }">
														</i> {{item.isVoter?'You have already voted':'+1 Vote'}}
													</div>
												</div>
												<div>
		                                            <span @mouseover="item.rewardHover = true">
		                                                <i v-for="star in item.stars"
		                                                   :class="{
		                                                    'fas fa-star': (star === 'full'),
		                                                    'far fa-star': (star === 'blank'),
		                                                    'fas fa-star-half-alt': (star === 'half')
		                                                    }">
		                                                </i>
		                                                <span class="reward">
		                                                   {{item.votes.length}}
		                                                    votes ({{item.percentageDomination}}%)
		                                                </span>
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
										<div class="replies" v-if="item.repliesSystem.length > 0" v-tooltip="{ content:
		                                          item.repliesPros+' pros, '+item.repliesCons+' cons ('+(item.repliesPros/item.repliesWeight)*100+'%, '+(item.repliesCons/item.repliesWeight)*100+'%)' }">
		                                    <span v-for="(reply, k) in item.repliesSystem" v-if="k <= 24" class="reply"
		                                          :class="{'cons': reply == 'cons', 'pros': reply == 'pros'}" >
		                                    </span>
											<span v-if="item.repliesSystem.length > 24" class="reply with-content">
		                                        +{{item.repliesSystem.length-12}}
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
					<button v-if="!busy" @click="addComment" class="btn btn-confirm">
						Add
					</button>
					<button v-else-if="busy" class="btn btn-confirm">
						<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
					</button>
				</div>
			</div>
		</modal>
		<modal name="problem-introduce" height="auto" :scrollable="true" style="padding-top:100px;padding-bottom:50px;">
			<div class="problem-modal" v-if="problem.json_metadata">
				<div class="header-img"
				     :style="{ 'background-image': 'url(' + problem.json_metadata.image[0] + ')' }"></div>
				<div class="desc">
					<p v-html="problem.json_metadata.description"></p>
				</div>
			</div>
		</modal>
		<vue-snotify></vue-snotify>
	</div>
</template>
<script>
	import _ from 'lodash'
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
    import HelperMain from '../helpers/main'

    import 'vue-directive-tooltip/css/index.css';
    import "vue-snotify/styles/material.css";
    import "../assets/css/discussionOrPoll.scss";

    Vue.use(Snotify);
    Vue.use(VModal);
    Vue.use(Tooltip);

    export default {
        name: 'poll',
	    mixins: [HelperMain],
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
            },
	        pollElementsSorted()
	        {
                return _.orderBy(
                    this.pollElements,
	                (e) => {
		                e.percentageDomination =
			                (0 === this.pollVotes.length ?
					                0 : Math.floor((e.votesCount/this.pollVotes.length)*100)
			                );

		                return e.votesCount
	                },
	                'desc');
	        }
        },
        data() {
            return {
                busy: true,
	            type: 'poll',
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

	            state: {},
	            problem: {},

	            pollElements: [],

	            currentItem: {},
	            currentPollElement: {},

	            currentComments: {},
	            comments: {},
                nonDirectlyComments: [],
                pollVotes: [],

	            history: [],

	            map: {
                    right: [],
		            left: [],
		            way: '',
		            position: 1
	            },
	            url: {
                    origin: "",
		            current: ""
	            },
	            menu: {
                    nonDirectly: false,
                    mapOpened: true,
		            busyReSteem: false,
	            },
                add: {
                    type: '',
                    desc: ''
                },
                refreshTimer: ""
            }
        },
        watch: {},
        components: {
            VModal,
            EditorContent,
            EditorMenuBar,
            EditorMenuBubble,
        },
        methods: {
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
            addComment: function()
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
                    userImg: this.$store.state.user.avatar,
	                chosen: this.currentPollElement.title
                };

                let author = this.$store.state.user.name;
                let perm = Math.random().toString(36).substring(2);
                let systemType = this.currentItem.systemType;

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
                                    parent_author: (systemType === "pollElement" ? this.problem.author : this.currentItem.author ),
                                    parent_permlink: (systemType === "pollElement" ? this.problem.permlink : this.currentItem.permlink ),
                                    permlink: perm,
                                    title: this.add.type + ": " + this.currentPollElement.title
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
                    this.reloadComments();

                    this.busy = false;

                    this.$snotify.success('Comment added', 'Success!');
                    this.$modal.hide('add-pros-or-cons');

                }).catch((error) => {
                    if(error)
                    {
                        this.$snotify.error(error.response.data.error_description, 'Steem error');
                        this.busy = false;
                    }
                });
            },
            showLinkMenu(attrs) {
                this.linkUrl = attrs.href;
                this.linkMenuIsActive = true;
                this.$nextTick(() => {
                    this.$refs.linkInput.focus()
                })
            },
            hideLinkMenu() {
                this.linkUrl = null;
                this.linkMenuIsActive = false
            },
            setLinkUrl(command, url) {
                command({ href: url });
                this.hideLinkMenu();
                this.editor.focus()
            },
            renderUserContent(topicType, comments, currentItem, back = false)
            {
                let current = this.currentItem;
				let commentsToRender = [];

                let replies = current.replies;

                switch(current.systemType)
                {
                    case "start":
                        break;
                    case "commentElement":
                    case "pollElement":
                        $.each(replies, (item, value) =>
                        {
                            if(comments[value])
                            {
                                let meta = "";
                                $.each(comments[value].replies, (_i, _v) =>
                                {
                                    meta = comments[_v].json_metadata;

                                    if(meta.type === "cons")
                                    {
                                        comments[value].repliesCons++;
                                    }

                                    if(meta.type === "pros")
                                    {
                                        comments[value].repliesPros++;
                                    }

                                    if(meta.type !== "vote")
                                    {
                                        comments[value].systemReplies.push({type: meta.type});
                                    }
                                });

                                commentsToRender.push(comments[value]);
                            }
                        });
                        break;
                }

                this.currentComments = commentsToRender;


	            this.renderMap(back);
            },
	        renderMap: function(back = false)
	        {
                let currentComments = this.currentComments;
                let currentItem = this.currentItem;

                if(back)
                {
                    if(this.currentItem.systemType === "start")
                    {
                        this.map.way = "";
                        this.map.position = 0;
                    }

                    if(this.map.way)
                    {
                        let columnIndex = this.map[this.map.way].length-1;

                        $.each(this.map[this.map.way][columnIndex], function(i, v) {
                            v.active = false;
                        });

                        if(this.map.way === "left" && this.map.position)
                        {
                            if(this.map.left.length > 1)
                            {
                                let arr =  this.map.left.slice().reverse();
                                arr.splice(0, 1);

                                this.map.left = arr.slice().reverse();
                            }
                            //let arrIndex = arr.length-1;
/*
                            console.log(arrIndex);
                            if(arrIndex > 0)
                            {
                                this.map[this.map.way] = arr.splice(arrIndex, 1);
                            }else{
                                this.map[this.map.way] = arr.splice(1, 1);
                            }*/
                        }

                        if(this.map.way === "right")
                        {

                        }

                        if(this.currentItem.author === "" && this.currentItem.permlink === "")
                        {
                            this.map.way = "";
                            this.map.position = 1;

                            $.each(this.map.left, function(i, v) {
                                $.each(v, function(_i, _v) {
                                    _v.active = false;
                                });
                            });

                            $.each(this.map.right, function(i, v) {
                                $.each(v, function(_i, _v) {
                                    _v.active = false;
                                });
                            });
                        }

                        this.map.position = 1;
                    }else{
                        this.map.left = [];
                        this.map.right = [];
                        this.map.position = 0;
                    }
                    return;
                }

                if("pollElement" === currentItem.systemType)
                {
                    let firstPros = false;
                    let firstCons = false;

                    let columnPros = this.map.left.length-1;
                    let columnCons = this.map.right.length-1;

					$.each(currentComments, (i, v) =>
					{
						if("pros" === v.type)
						{
						    if(!firstPros)
						    {
                                this.map.left.push([]);

                                columnPros++;
                                firstPros = true;
						    }

							this.map.left[columnPros].push(
							    {
								    title: "Pros: " + v.json_metadata.desc,
								    active: false,
								    type: 'pros',
                                    url: v.author+"/"+v.permlink
							    }
							);
						}

                        if("cons" === v.type)
                        {
                            if(!firstCons)
                            {
                                this.map.right.push([]);

                                columnCons++;
                                firstCons = true;
                            }

                            this.map.right[columnCons].push(
                                {
                                    title: "Cons: " + v.json_metadata.desc,
                                    active: false,
                                    type: 'cons',
	                                url: v.author+"/"+v.permlink
                                }
                            );
                        }
					});

                    this.map.way = "";
                }

                if("commentElement" === currentItem.systemType)
                {
                    if(!this.map.way)
                    {
                        switch(this.currentItem.type)
                        {
	                        case 'pros':
                                this.map.way = "left";
	                            break;
                            case 'cons':
                                this.map.way = "right";
                                break;
                        }
                    }

                    let firstItem = false;
                    let columnIndex = this.map[this.map.way].length-1;

                    $.each(this.map[this.map.way][columnIndex], (i, v) =>
                    {
						if(v.url === currentItem.author+"/"+currentItem.permlink)
						{
                            v.active = true;
                            return false;
						}
                    });

                    $.each(currentComments, (i, v) =>
                    {
                        if(!firstItem)
                        {
                            this.map[this.map.way].push([]);

                            columnIndex++;
                            firstItem = true;
                        }

                        this.map[this.map.way][columnIndex].push(
                            {
                                title: v.json_metadata.type.charAt(0).toUpperCase() + v.json_metadata.type.slice(1)+": " + v.json_metadata.desc,
                                active: false,
                                type: v.json_metadata.type,
                                url: v.author+"/"+v.permlink
                            }
                        );
                    });
                }
	        },
            reBlog: function()
            {
                if(this.menu.busyReSteem)
                {
                    return;
                }

                this.menu.busyReSteem = true;

                this.$store.state.api.reblog(
                    this.$store.state.user.name,
                    this.problem.author,
                    this.problem.perm,
                    (err, res) => {
                        this.menu.busyReSteem = false;

                        if(err)
                        {
                            this.$snotify.error('Something went wrong, try again for a minute', 'Fail');
                            return;
                        }

                        this.$snotify.success('Topic has reblogged', 'Success');
                    });
            },
            changeCurrentItem: function(item, back = false)
            {
                let current = [];

                if(back)
                {
                    let index = this.history.length-1;
                    current = this.history[index];
                    this.history.splice(index, 1);
                }else{
                    current = item;
                    this.history.push(this.currentItem);
                }

                this.currentItem = current;

                if(this.currentItem.systemType === "pollElement")
                {
                    this.currentPollElement = current;
                }

                this.renderUserContent("poll", this.comments, "", back);
            },
            voteComment: function(item, currentBox = false)
            {
                if(item.busyVote || item.isVoter)
                {
                    return;
                }

                item.busyVote = true;

                let desc = "Voted on <i>"+item.title+"</i>!";

                if(item.systemType === "pollElement")
                {
                    let meta = {
                        type: 'vote',
                        desc: desc,
	                    chosen: item.title,
                        userImg: this.$store.state.user.avatar
                    };

                    let author = this.$store.state.user.name;
                    let perm = Math.random().toString(36).substring(2);

                    let data = {
                        operations:
                            [
                                [
                                    "comment",
                                    {
                                        author: author,
                                        body:
                                        meta.desc+" <p class='__dfooter'><sub>Voted via <a href='https://discut.io'>Discut.io</a>, debates without censorship!</sub></p>",
                                        json_metadata: JSON.stringify(meta),
                                        parent_author: this.currentItem.author,
                                        parent_permlink: this.currentItem.permlink,
                                        permlink: perm,
                                        title: "Vote: "+item.title
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
                        item.busyVote = false;
                        item.isVoter = true;
                        this.$snotify.success('Vote added', 'Success!');
                    }).catch((error) => {
                        if(error)
                        {
                            item.busyVote = false;
                            this.$snotify.error(error.response.data.error_description, 'Steem error');
                            this.busy = false;
                        }
                    });
                    return;
                }

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
	        reloadComments()
	        {
	            this.busy = true;

                steem.api.getState("/discutio/" + this.url.origin, (err, result) =>
                {
                    if(!err)
                    {
                        let isExists = false;
                        let values = this.estimateValuesForComments(result.content);

                        $.each(values.comments, (index, value) =>
                        {
                            isExists = false;

                            $.each(this.comments, (i, v) =>
                            {
								if(index === i){
                                    isExists = true;
                                    return false;
								}
                            });

                            if(!isExists) {
                                if (typeof value.json_metadata.type != 'undefined' &&
	                                (
	                                    value.json_metadata.type == 'pros' ||
	                                    value.json_metadata.type == 'cons'
	                                )
                                ) {
                                    value.stars = ["blank", "blank", "blank", "blank", "blank"];

                                    let arr =  this.map[this.map.way].slice().reverse();
                                    arr.splice(arr.length-1, 1);

                                    this.comments[index] = value;
                                    this.currentItem.replies.push(index);
                                    return true;
                                }
                            }
                        });

                        this.renderUserContent("poll", this.comments, "");
                        this.busy = false;
                    }
                });
	        },
            init()
            {
                if(this.$store.state.loaded)
                {
                    clearInterval(this.refreshTimer);

                    this.url.origin = this.parseUrlForSteem(
                        this.$route.params.user,
                        this.$route.params.slug
                    );

                    this.url.current = this.url.origin;

                    steem.api.getState("/discutio/" + this.url.origin, (err, result) =>
                    {
                        if(!err)
                        {
                            let values = this.estimateValuesForComments(result.content);

                            this.problem = this.findMainTopic(values.comments, this.url.origin);

                            if(this.problem.json_metadata.type == 1)
                            {
                                window.location = '/';
                                return;
                            }

                            this.problem = this.estimateStars(this.problem, values.starValue);

                            this.$store.dispatch('setTopicMode',
                                {
                                    mode: true,
                                    name: this.problem.title +
                                    "<span class='pill'><i class='far fa-chart-bar'></i> Poll</span>",
                                    img: this.problem.json_metadata.image[0]
                                }
                            );

                            document.title = this.problem.title + " - Poll on Discut.io";
                            this.currentItem = this.problem;

                            $.each(this.problem.json_metadata.choices, (i, v) =>
                            {
                                this.pollElements.push(
                                    {
                                        title: v.title,
                                        desc: v.desc,
                                        votes: [],
                                        votesCount: 0,
                                        type: 0,
                                        users: [],
                                        author: "",
                                        permlink: "",
                                        replies: [],
                                        stars: [],
                                        rewardHover: false,
                                        isVoter: false,
                                        busyVote: false,
                                        systemType: "pollElement",
                                        percentageDomination: 0,
                                        repliesWeight: 0,
                                        repliesCons: 0,
                                        repliesPros: 0,
                                        repliesSystem: [],
                                        reward: 0
                                    }
                                )
                            });

                            let chosen = ""; //option name
                            let type = "";

                            let wrongAccounts = ["steemitboard", "pennsif"];

                            let userName = "";

                            if(typeof this.$store.state.user.name != "undefined")
                            {
                                userName = this.$store.state.user.name;
                            }

                            $.each(values.comments, (index, value) =>
                            {
                                if (typeof value.json_metadata.type == 'undefined')
                                {
                                    if(wrongAccounts.indexOf(value.author) === -1)
                                    {
                                        this.nonDirectlyComments.push(value);
                                    }

                                    delete values.comments[index];
                                    return true;
                                }

                                value.isVoter = false;

                                if(userName)
                                {
                                    $.each(value.active_votes, (voteIndex, voteValue) =>
                                    {
                                        if(voteValue.percent > 0 && voteValue.voter == userName)
                                        {
                                            value.isVoter = true;
                                            return false;
                                        }
                                    });
                                }

                                if(this.problem.author+"/"+this.problem.permlink === value.author+"/"+value.permlink)
                                {
                                    delete values.comments[index];
                                    return true;
                                }

                                chosen = value.json_metadata.chosen;
                                type  = value.json_metadata.type;

                                $.each(this.pollElements, (pollIndex, pollValue) =>
                                {
                                    if(pollValue.title === chosen)
                                    {
                                        switch(type)
                                        {
                                            case "vote":
                                                if(this.pollElements[pollIndex].votes.indexOf(index) === -1)
                                                {
                                                    this.pollElements[pollIndex].votes.push(index);
                                                    this.pollElements[pollIndex].votesCount++;
                                                    this.pollElements[pollIndex].reward++;
                                                    this.pollVotes.push(value);

                                                    if(value.author === userName)
                                                    {
                                                        this.pollElements[pollIndex].isVoter = true;
                                                    }

                                                    delete values.comments[index];
                                                }
                                                break;
                                            case "cons":
                                            case "pros":
                                                if(value.parent_author+"/"+value.parent_permlink !== this.problem.author+"/"+this.problem.permlink)
                                                {
                                                    return true;
                                                }
                                                if(this.pollElements[pollIndex].replies.indexOf(index) === -1) {
                                                    this.pollElements[pollIndex].replies.push(index);
                                                    this.pollElements[pollIndex].repliesWeight++;
                                                    this.pollElements[pollIndex].repliesSystem.push(type);

                                                    switch(type)
                                                    {
                                                        case "pros":
                                                            this.pollElements[pollIndex].repliesPros++;
                                                            break;
                                                        case "cons":
                                                            this.pollElements[pollIndex].repliesCons++;
                                                            break;
                                                    }
                                                }
                                                break;
                                        }

                                        return false;
                                    }
                                });

                                values.comments[index] = this.estimateStars(value, values.starValueWithoutTopic);
                            });

                            let bestStarReward = 0;

                            $.each(this.pollElements, (i, v) => {

                                bestStarReward += v.reward;
                            });

                            bestStarReward = bestStarReward/5;

                            $.each(this.pollElements, (i, v) => {

                                this.pollElements[i] = this.estimateStars(v, bestStarReward);
                            });

                            this.comments = values.comments;
                            this.history.push(this.currentItem);

                            this.renderUserContent(this.type, this.comments, this.currentItem);

                            this.busy = false;
                        }else{
                            this.busy = false;
                        }
                    });
                }
            },
        },
        mounted()
        {
            this.$store.dispatch('setTopicMode', {mode: false, name: ""});
            this.$store.dispatch('setMenuStatus', true);

            this.refreshTimer = setInterval(() =>
            {
                this.init();
            }, 1000)
        }
    }
</script>
