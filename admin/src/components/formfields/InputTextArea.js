import React, { Component } from "react";
import PropTypes from "prop-types";
// import { TextArea } from 'semantic-ui-react';
import FormField from "./FormField";
import onlyDOMProps from "util/onlyDOMProps";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import criaconsole from "util/myconsole";

// import Jodit from 'jodit'
// npm install jodit
import * as JoditEditor from "jodit";
import "jodit/build/jodit.min.css";

const _debug = false;
const myconsole = criaconsole(
  _debug,
  " *** InputTextArea| ",
  "color:orange;font-weight:bold"
);

// Input Text Area
//---------------------------

export default class InputTextArea extends React.Component {
  static defaultProps = {
    disabled: false,
    richText: true,
  };

  componentDidMount() {
    //faco a altura inicial ficar conforme o conteudo
    if (this.input) {
      this.updateHeight();
      if (this.props.richText) {
        this.editor = new JoditEditor.Jodit(this.input, {
          toolbarButtonSize: "small",
          enter: "P",
          defaultMode: "1",
          toolbarStickyOffset: null,
          showCharsCounter: false,
          showWordsCounter: false,
          showXPathInStatusbar: false,
          height: 300,
          buttons:
            ",,,,,,,,,,,,,,,,,,,,,video,table,link,|,align,undo,redo,\n,cut,hr,eraser,copyformat,|,fullsize",
        });

        this.editor.events.on("change", (data) => {
          // console.log(data)
          const { input } = this.props;
          input.onChange(data);
          // console.log(this.editor.value)
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateHeight();
  }

  onChange = (e) => {
    const { input } = this.props;
    input.onChange(e.target.value);
    this.updateHeight();
  };

  updateHeight = () => {
    if (this.input) {
      this.input.style.height = "auto";
      this.input.style.maxHeight = "350px";
      //pego quantas linhas tenho com a altura auto
      let alturaInterna = this.input.scrollHeight;
      let alturaReal = this.input.clientHeight;
      let totalLinhas = Math.ceil(alturaInterna / alturaReal);
      let alturaFinal = alturaReal * totalLinhas;

      if (alturaFinal > 350) alturaFinal = 350;
      myconsole.log("totalLinhas", totalLinhas);
      if (totalLinhas > 1) this.input.style.height = alturaFinal + 20 + "px";
    }
  };

  render() {
    const {
      req,
      maxChar,
      input,
      label,
      meta: { touched, error, valid, dirty },
      ...custom
    } = this.props;

    if (this.props.req && this.props.subField) {
      custom.placeholder += "*";
    }

    let onChange = this.props.onChange || this.onChange;

    //  let onBlur = this.props.onBlur || this.onBlur

    return (
      <FormField {...this.props}>
        <div
          className="ui fluid input input-wrap input-textarea"
          style={{ maxHeight: "350px" }}
        >
          {(!this.props.richText && (
            <textarea
              className="ui fluid input "
              rows="5"
              id={"input-" + input.name}
              {...input}
              {...onlyDOMProps(custom)}
              ref={(input) => (this.input = input)}
              onChange={onChange}
              disabled={this.props.disabled}
            />
          )) || (
            <textarea
              className="ui fluid input "
              rows="5"
              id={"input-" + input.name}
              {...input}
              {...onlyDOMProps(custom)}
              ref={(input) => (this.input = input)}
              onChange={onChange}
              disabled={this.props.disabled}
            />
          )}
        </div>
      </FormField>
    );
  }
}

class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    let html = props.value;

    // html= this.nl2br(html)

    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  state = {
    editorState: EditorState.createEmpty(),
  };

  nl2br = (str, is_xhtml) => {
    var breakTag =
      is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
    return (str + "").replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
      "$1" + breakTag + "$2"
    );
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    var value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.onChange(value);
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        style={{ maxHeight: "350px" }}
        toolbarOnFocus={true}
        toolbar={{
          options: ["inline", "blockType", "link", "list", "emoji", "remove"],
          inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ["bold", "italic", "underline"],
          },

          blockType: {
            inDropdown: true,
            options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
          },
        }}
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    );
  }
}
