import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import axios from "axios";
import swal from 'sweetalert';
import { Container,Row,Col,Card,CardTitle,CardBody,Button} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { HeaderDemo } from "../../components/HeaderDemo";
//import CSVReader from 'react-csv-reader';
//import CsvParse from '@vtex/react-csv-parse'
//import rp from "request-promise";
//import cheerio from "cheerio";


class Scraping extends Component {

constructor(props) {
        super(props)
        this.state = {
          data: [],
          undoneDirInfo: [],
          doneDirInfo: [],
          newDoneDir: [],
          dir_config:'',
          config_row_id:'',
          dirDBList:'',
          scrapStateMsg: "Scraping not initialize...",
          scrapStateDoneMsg:'Click on Start button to initialize/start scrapping',
          apiGet:false,
          loading: false
        }
}




handleScrapping(e) {    
      
   //###############################################
    this.setState({ loading: true }, () => {

      //########## Config data get API Start #############
      const confdata = axios.get('http://localhost:5000/api/config')
      .then(res => {

        this.setState({loading: false,});   
        let dir_config = res.data.result;
        let config_row_id = res.data.rowid;
        this.setState({ dir_config });
        this.setState({ config_row_id });

        var dirInfo = JSON.parse(dir_config);

        let dirDBList = dirInfo[0];
        this.setState({ dirDBList });

        //return res.data.result;
        return res;

        //console.log(config_row_id);
        //data: [...result.data],
        //console.log(this.state.dir_config);
        //console.log(dirInfo[0]);

      }, function (error) {
          
          if(error){
            console.log(error.response);
            swal({
              icon: 'error',
              title: 'Database Error!',
              text: 'database connection error!',
              footer: '<a href>Try Again</a>'
            });
            //return;
            return Promise.reject(error); 
          }

          
          console.log(error);
          
      });
      //########## Config data get API End #############
     

      var undoneDirInfo = [];
      var doneDirInfo = [];
      var dirObj = this.state.dirDBList;
      
      Object.entries(dirObj).forEach(entry => {
          let key = entry[0];
          let value = entry[1];
          //console.log(key);
          if(value === 0){
            undoneDirInfo.push(key);
          }
          if(value === 1){
            doneDirInfo.push(key); 
          }
      });

      //this.setState({ undoneDirInfo });
      //this.setState({ doneDirInfo });
              
      console.log(undoneDirInfo);
      console.log(doneDirInfo);



      const originalArray = undoneDirInfo;
      const newArray = [];
      for (let i = 0; i < originalArray.length; i++) {

          
          axios.get('http://127.0.0.1:5000/scraperapi/'+originalArray[i])
            .then(res => { 

              this.setState({loading: false,});   //data: [...result.data],
              const stockparam = res;
              this.setState({ stockparam });
              console.log(stockparam);
              this.setState({apiGet: true});


              //this.setState({newDoneDir: [...originalArray[i]]});

              

              //#############################
              const newArrayS = [];  
              newArrayS[i] = originalArray[i];

              console.log("New Array:-----"+newArrayS);
              doneDirInfo.push(...newArrayS);
              doneDirInfo.sort();
              console.log(doneDirInfo.sort());

              // var array = [0, 1, null, 2, "", 3, undefined, 3,,,,,, 4,, 4,, 5,, 6,,,,];
              // var filtered = array.filter(function (el) {
              //   return el != null;
              // });
              // console.log(filtered);

              // var arr = doneDirInfo.filter(function(e){return e});
              // console.log(arr);
              // this.setState({newDoneDir: arr});

              //console.log("New Array:-----"+newArrayS);
              // doneDirInfo.push(...arr);
              // doneDirInfo.sort();
              // console.log(doneDirInfo.sort());
              
              // axios.post('http://127.0.0.1:5000/api/configUpdate/'+this.state.config_row_id, doneDirInfo)
              //   .then(res => {
              //   console.log('UPDATED');        
              //   console.log(res);
              // });


              //#############################
           
               
              //alert('a');       
                            
            },(error) => { 
                console.log(error);
                //newArray[i] = 'B'; 
                if(error){
                  this.setState({apiGet: true});
                }
              }
            );

            //if(this.state.apiGet === true){
              //newArray[i] = originalArray[i];
            //}
             

            
      }

      console.log("State Data:"+this.state.newDoneDir);
      
      // console.log("New Array:-----"+newArray);
      // doneDirInfo.push(...newArray);
      // doneDirInfo.sort();
      // console.log(doneDirInfo.sort());

      // const modArray = [];
      // for (let i = 0; i < doneDirInfo.length; i++) {

      //     modArray[i] = '"'+doneDirInfo[i]+'":'+i;        
         
      // }
      // console.log(modArray);
      // var arr = new Array(modArray); 
      // var str = arr.join();
      // console.log(str );
      //var obj = "[{"+ str +"}]";
      // console.log(obj);

      console.log(this.state.config_row_id);

      // axios.post('http://127.0.0.1:5000/api/configUpdate/'+this.state.config_row_id, doneDirInfo)
      //   .then(res => {
      //   console.log('UPDATED');        
      //   console.log(res);
      // });

      



     






      // axios.get('http://127.0.0.1:3005/scraper')
      // .then(res => {

      //   this.setState({loading: false,});   //data: [...result.data],
      //   const stockparam = res;
      //   //this.setState({ stockparam });
      //   console.log(stockparam);

      // })      

      //const postPrfx = map(url_postfix, ({ x, y }) => ({ 
        //console.log(x);
      //}));      

    });

    //##############################################

    // swal({
    //   icon: 'success',
    //   //title: '!',
    //   text: 'Scraping Done!',
    //   footer: '<a href>Go here to see uploaded data</a>'
    // })

    // affectedRows - Insert
    // warningCount - Duplicate
    // changedRows

    //});
    //window.location = 'http://127.0.0.1:4100/tables/stock-market'; 

    event.preventDefault();
    //}
    //########  Stock Parameter Add Form End  ##########


}


render() {
    const keys = [
    "company_symbol",
    "market_symbol",
    ];

    const loading = this.state.loading;

    //console.log(this.state.data);


    return (
            <React.Fragment>
        <Container><Row> 
        <HeaderMain 
                title="Scrap From Site"
                className="mb-5 mt-4"
            />
                
            </Row>
            { /* END Header 1 */}
            { /* START Section 1 */}
            <Row>
                <Col lg={ 6 }>
                    <Card className="mb-3">
                        <CardBody>
                            
                            { /* START FormStockParam */}                            
                           
    <button type="button" name="Start" onClick={e => this.handleScrapping(e)}>Start</button><br/><br/>
    <span ><b>{this.state.scrapStateMsg}</b> <b>{this.state.scrapStateDoneMsg}</b> </span>

    {loading ? 'Scrapping...please wait!' : ''}

                            { /* END Form */}
                        </CardBody>
                    </Card>
                    
                </Col>
                
            </Row>
            { /* END Section 1 */}

        </Container>
    </React.Fragment>

        )
    }
}

export default Scraping;