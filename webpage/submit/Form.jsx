import {HelpBlock,FormGroup, FormControl, ControlLabel,FieldGroup} from 'react-bootstrap'


export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    this.setState({
      [name]:value
    })
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + JSON.stringify(this.state));
    event.preventDefault();
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className ="col-xs-3">
               <FormGroup bsSize="small" controlId="song">
                  <ControlLabel>Song Title:</ControlLabel>
                  <FormControl type="text" placeholder="歌曲名" onChange={this.handleChange} />
                </FormGroup>
            </div>
            <div className ="col-xs-3">
         <FormGroup bsSize="small" controlId="artist">
            <ControlLabel>Artist Name:</ControlLabel>
            <FormControl type="text" placeholder="艺术家" onChange={this.handleChange} />
          </FormGroup>
          </div>
          </div>

        <div className="row">
          <div className="col-xs-4">
            <FormGroup  bsSize="large" controlId="cnLyrics">
              <ControlLabel>Chinese Character Lyrics:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="中文歌词" onChange={this.handleChange}/>
              <HelpBlock>Insert the Chinese Lyrics here.</HelpBlock>
            </FormGroup>
          </div>
          <div className="col-xs-4">
            <FormGroup  bsSize="large" controlId="pinyinLyrics">
              <ControlLabel>Pinyin Lyrics:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="拼音" onChange={this.handleChange}/>
              <HelpBlock>Insert the Pinyin of the Chinese Characters here.</HelpBlock>
            </FormGroup>
          </div>
          <div className="col-xs-4">
            <FormGroup  bsSize="large" controlId="engLyrics">
              <ControlLabel>English Translation:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="英文翻译" onChange={this.handleChange}/>
              <HelpBlock>Insert the English Translation of the Lyrics here.</HelpBlock>
            </FormGroup>
          </div>
        </div>
        <FormGroup controlId="audioFile">
          <ControlLabel>MP3 Upload</ControlLabel>
          <FormControl type="file" onChange={this.handleChange}/>
          <HelpBlock>Example block-level help text here.</HelpBlock>
        </FormGroup>

        <FormGroup  bsSize="large" controlId="times">
          <ControlLabel>Line Timings:</ControlLabel>
          <FormControl componentClass="textarea" placeholder="时间轴" onChange={this.handleChange}/>
          <HelpBlock>Insert the Timings of Line Transitions of the Lyrics here.</HelpBlock>
        </FormGroup>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
// <input type="text" value={this.state.chineseCharLyrics} onChange={this.handleChange} />