import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import equals from '../../helpers/Equals';
import {
  showFile,
  addFile,
  unAddFile,
  checkoutFile,
  deleteFile
} from '../../actions/fileActions';
import { IAppState } from '../../reducers/app';
import File, { IFileProps } from './File';

export function FileBox(props) {
  return (
    <File {...props} />
  );
}

const mapStateToProps = ({ app }: { app: IAppState }, props: IFileProps) => {
  return { selected: equals(app.fileShown, props.file) };
};

const mapDispatchToProps = dispatch => ({
  showFile: bindActionCreators(showFile, dispatch),
  addFile: bindActionCreators(addFile, dispatch),
  unAddFile: bindActionCreators(unAddFile, dispatch),
  checkoutFile: bindActionCreators(checkoutFile, dispatch),
  deleteFile: bindActionCreators(deleteFile, dispatch)
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileBox);

export default connected as any;

