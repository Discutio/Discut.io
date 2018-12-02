<template>
  <div>
        <div class="header" style="background-image:url(https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.smore.com%2Fexternal_image%3Furl%3Dhttp%3A%2F%2Fwww.cultofpedagogy.com%2Fwp-content%2Fuploads%2F2015%2F10%2FDiscussion.png&f=1)">
        <div class="shadow-inset"></div> 

              <div class="top-thread">
                <p>{{tip}}</p> 
                <h1>Does other civilization exists in Cosmos?</h1>
                <div class="action"> 
                  <a href="#" class="btn btn-discutio-blue">Open discussion</a>
                </div>
                <div class="created">
                  by   
                  <img src="https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Forig07.deviantart.net%2F671c%2Ff%2F2010%2F144%2F5%2Fc%2Fforum_avatar_by_agile_olives.png&f=1"> 
                  cryptoshark 
                </div>
                <div class="or">
                    <span>– or explore by tags –</span> 
                </div>
                <div class="tags">
                    <a href="#">Philosophy</a>
                    <a href="#">Ethic</a>
                    <a href="#">Chemistry</a>
                    <a href="#">Drugs</a>
                    <a href="#">Cosmos</a>
                    <a href="#">Technology</a>
                    <a href="#">Education</a>
                    <a href="#">World</a>
                </div>
              </div> 
            
      </div>  
      <div class="container header-tabs">
        <div class="row">
          <div class="col-lg-12">
              <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#home">Trend</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#menu1">
                      <i class="fa fa-fire" aria-hidden="true"></i> Hot
                    </a> 
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#menu2">Newest</a>
                  </li>
              </ul>
          </div>
        </div>
      </div>
      <div class="content">
          <div class="tab-content">
              <div class="tab-pane container active" id="home">
                <div class="container">
                  <div class="row">
                      <div class="col-lg-3">
                        <div class="disscusion-widget radius-15" style="background-image:url(https://religionnews.com/wp-content/uploads/2018/04/webRNS-God-Sistine-042518-768x576.jpg)">
                          <div class="shadow-inset radius-15"></div>
                          <div class="self">
                            <h2>A god exists?</h2>
                            <p> 
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Quisque eu eleifend risus. Fusce eu convallis quam, et consequat tel...
                            </p>
                            <div class="action">
                              <a href="#" class="btn btn-discutio-blue">Open</a>
                            </div>
                          </div>
                        </div>       
                      </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane container fade" id="menu1">...</div>
              <div class="tab-pane container fade" id="menu2">...</div>
            </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
