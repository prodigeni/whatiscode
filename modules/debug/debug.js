!(function(){
  var width = 960,
      height = 500

  var svg = d3.select('#debug').append('svg')
      .attr({width: width, height: height})
      .style({position: 'absolute', top: '0px'})


  var module = {sel: d3.select('#debug')}
  addModule(module)

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "There are bugs in your code! Click the line of code that looks like they are BUG-FREE. And to make it extra-realistic, we made it so that every time you don’t fix a bug, a new bug is born. This is the true experience of programming!"
    },
    {
      "emote": "chill"
    }
  ];

  // announce itself
  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);
  module.oninit = function() {
    module.bot.dialogue(dialogue);
  }


  var bugs = [
    { img: 'bug.svg',
      pos: [width*.01, height*.05],
      wrong: 'var salesPlusFour = "4" + sales;',
      right: 'var salesPlusFour = 4 + sales;'},
    { img: 'bug.svg',
      pos: [width*.75, height*.05],
      wrong: 'for (var i = 0; i < 10 i++)',
      right: 'for (var i = 0; i < 10; i++)'},
    { img: 'bug.svg',
      pos: [width*.75, height*.75],
      wrong: 'if (newBug == oldBug)',
      right: 'if (newBug === oldBug)'},
    { img: 'bug.svg',
      pos: [width*.02, height*.75],
      right: 'var total += currentValue',
      wrong: 'var total = +currentValue'},
    { img: 'bug.svg',
      pos: [width*.50, height*.50],
      wrong: 'isBetween = min < next < max',
      right: 'isBetween = min < next && next < max'},
    { img: 'bug.svg',
      pos: [width*.0, height*.4],
      wrong: 'var x = Math.Sin(θ)',
      right: 'var x = Math.sin(θ)'},
    { img: 'bug.svg',
      pos: [width*.40, height*.10],
      wrong: 'obj.function()',
      right: 'obj && obj.function && obj.function'},
  ]

  bugs.forEach(function(d){
    d.correct = false
    d.img = 'images/bug.svg'
    d.t = Math.random()
    d.visable = false
    d.spawned = false
  })

  function addBug(d, prev){
    if (!d || d.visable) return

    d.visable = true

    d.div = d3.select('#debug').append('div.bugg')

    d.imgEl = d.div.append('img.bug-img').attr('src', d.img)

    d.qcontainer = d.div.append('div.q-container')
    d.qcontainer
      .dataAppend(_.shuffle([d.right, d.wrong]), 'div.awnser')
        .text(ƒ())
        .on('click', function(e){
          if (d.correct) return

          if (d.right == e){
            d.correct = true
            d.imgEl.transition().delay(300).style('opacity', .3)
            d3.select(this).style('color', green)
            d.div.classed('correct', true)

            svg.append('g').dataAppend([[Math.random()*width, 0], [0, Math.random()*height]], 'path.lazer')
                .attr('d', function(e){ return ['M', e, 'L', e].join('') })
                .style({'stroke-width': 1, stroke: 'yellow'})
              .transition().duration(400)
                .attr('d', function(e){ return ['M', e, 'L', [d.pos[0] + 150, d.pos[1] + 50]].join('') })
                .style({'stroke-width': 8, stroke: red})
              .transition()
                .style('opacity', 0)
                .style('stroke-width', 50)

          } else{
            addBug(bugs.filter(_.negate(ƒ('visable')))[0], d)
            d3.select(this).style('color', red)
          }
        })


    if (prev && prev.pos){
      d.qcontainer.style('opacity', 0).style('pointer-events', 'none')
      d.imgEl.style('width', '0px')
        .transition().duration(800)
          .style('width', '100px')
      d.div.call(posAt, prev.pos)
        .transition().duration(1000).ease('cubic')
          .call(posAt, d.pos)
          .each('end', function(){
            d.qcontainer
                .style('pointer-events', 'all')
              .transition()
                .style('opacity', 1)
          })
      //todo - hide questions, till pos is done, scale bug size
    } else{
      d.div.call(posAt, d.pos)
    }

  }
  addBug(bugs[0])
  addBug(bugs[1])
  addBug(bugs[2])


  d3.timer(function(t){
    if (!module.active) return
    bugs.forEach(function(d){
      if (d.correct || !d.visable) return
      d.imgEl
        .style('-webkit-transform', 'rotate(' + Math.sin(t/500 + d.t*500)*30 + 'deg)')
        .style('padding-left', Math.sin(t/743 + d.t*500)*60 + 'px')
        .style('padding-top', Math.sin(t/343 + d.t*700)*20 + 'px')
    })
  })


  function posAt(sel, pos){
    sel .style('left', pos[0] + 'px')
        .style('top' , pos[1] + 'px')
  }
})();
