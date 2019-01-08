export default {
    name: 'helperMain',
    data() {
        return {
            _helper: {
                steemDollarPrice: 0
            }
        }
    },
    methods: {
        estimateValuesForComments(comments)
        {
            let bestReward = 0;
            let bestRewardWithoutTopic = 0;

            let obj = {};

            $.each(comments, (i, v) =>
            {
                if(typeof v === 'string')
                {
                    return true;
                }

                if(v.json_metadata == "")
                {
                    v.json_metadata = JSON.stringify({type: ""});
                }

                obj = JSON.parse(v.json_metadata);

                comments[i].json_metadata = obj;

                if(typeof obj.type == 'undefined')
                {
                    return true;
                }

                comments[i] = {
                    ...comments[i],
                    reward: this.calculateReward(v),
                    stars: [],
                    rewardHover: false,
                    isVoter: false,
                    busyVote: false,
                    showRewardPanel: false,
                    avatar: obj.userImg,
                    type: obj.type,
                    systemType: "commentElement",
                    systemReplies: [],
                    repliesPros: 0,
                    repliesCons: 0,
                    desc: obj.desc
                };

                if(comments[i].reward > bestReward)
                {
                    bestReward = comments[i].reward;
                }

                if(comments[i].reward > bestRewardWithoutTopic)
                {
                    if(this.problem.url === v.author + "/" + v.permlink)
                    {
                        return true;
                    }

                    bestRewardWithoutTopic = comments[i].reward;
                }
            });

            return {
                best : bestReward,
                bestWithoutTopic : bestRewardWithoutTopic,
                starValue: bestReward / 5,
                starValueWithoutTopic : bestRewardWithoutTopic / 5,
                comments: comments
            };
        },
        parseUrlForSteem(user, permlink)
        {
            if(user[0] !== "@")
            {
                user = "@" + user;
            }

            return user + "/" + permlink;
        },
        calculateReward(item)
        {
            return parseFloat(parseFloat(item.pending_payout_value.split(" ")[0]).toFixed(2))
                + parseFloat(parseFloat(item.total_payout_value.split(" ")[0]).toFixed(2))
        },
        estimateStars(item, bestReward)
        {
            let currentStars = [];
            let starType = "";

            let stringStars = (item.reward / bestReward).toFixed(1).split(".");
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

            item.stars = currentStars;

            return item;
        },
        findMainTopic(comments, originUrl)
        {
            let mainTopic = {};

            $.each(comments, (i, v) =>
            {
                if("@" + v.author + "/" + v.permlink === originUrl)
                {
                    mainTopic = v;
                    mainTopic.systemType = "start";
                    return false;
                }
            });

            return mainTopic;
        }
    },
    mounted()
    {

    }
}
