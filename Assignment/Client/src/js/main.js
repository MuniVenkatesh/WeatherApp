var React=require("react");
var cities=["Bangalore","Chennai","Delhi","Hyderabad","Mumbai","Ahmadabad","Kolkata"];
var WeatherFromDB=React.createClass({
  getInitialState:function(){
    var exist=[],
        remaining=cities;
    $.ajax({
          url: "/api/weathers",
          dataType: 'json',
          async:false,
          success: function(data){
              exist=data;
              data.map(function(d){
                if(remaining.indexOf(d.name)!=-1){
                  remaining.splice(remaining.indexOf(d.name),1);
                }
              });
          }.bind(this)
        });
    return ({data:exist,rem:remaining});
  },
  render:function(){
    var self=this;
    return(
      <div className="row">
            {this.state.data.map(function(d){
              return (
                   <div className="col-lg-12 well">
                   <div className="col-lg-10">
                    <button className="btn btn-link" type="submit" value={d.name} data-target="#full" data-toggle="modal" onClick={self.viewMore}>{d.name},{d.sys.country}</button>
                    {d.weather[0].description}
                    <p>
                    {d.main.temp}C temperature from {d.main.temp_min}C to {d.main.temp_max}C, wind {d.wind.speed}m/s, clouds {d.clouds.all}%, {d.main.pressure} hpa
                    </p>
                    <p>
                    Geo Coords: [{d.coord.lon}, {d.coord.lat}]
                    </p>
                    </div>
                    <div className="col-lg-2">
                    <button className="btn btn-info" type="submit" value={d.name} onClick={self.addDB}>Refresh</button>
                    </div>
                   </div>
                );
              })}
              {this.state.rem.map(function(d){
                return (
                     <div className="col-lg-12 well">
                      <div className="col-lg-10">
                      {d}
                      </div>
                      <div className="col-lg-2">
                      <button className="btn btn-info" type="submit" value={d} onClick={self.addDB}>Refresh</button>
                      </div>
                     </div>
                  );
                })}
        </div>
    )
  },
  addDB:function(e){
    var name=e.target.value;
    $.ajax({
          url: "http://api.openweathermap.org/data/2.5/weather?q="+name+"&appid=2dc381ef974c707eb15b9f63bb0642d6&units=metric",
          dataType: 'json',
          success: function(data){
              var rem=this.state.rem;
              if(rem.indexOf(name)!=-1){
                $.ajax({
                      url: "/api/add",
                      dataType: 'json',
                      data:JSON.stringify(data),
                      type:"POST",
                      processData:false,
                      contentType: 'application/json',
                      success: function(d){
                        alert(d.name+" weather added succesfully")
                      }.bind(this)
                    });
                  rem.splice(rem.indexOf(name),1);
                  var list=this.state.data;
                  list.push(data);
                  this.setState({data:list,rem:rem});
              }
              else{
                $.ajax({
                      url: "/api/refresh/"+name,
                      data:data,
                      type:"PUT",
                      success: function(d){
                        alert(d+" weather updated succesfully")
                      }.bind(this),
                      error:function(){
                        console.log("Error");
                      }
                    });
              }
          }.bind(this)
        });
  }
});

React.render(<WeatherFromDB />,document.getElementById("app"));
