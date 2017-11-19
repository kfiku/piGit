import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import equals from '../../helpers/Equals';
import actions from '../../actions';
import { IAppState } from '../../reducers/app';
import File, { IFileProps } from './File';

export function FileBox(props: IFileProps) {
  return (
    <File {...props} />
  );
}

const mapStateToProps = ({ app }: { app: IAppState }, props: IFileProps) => {
  return { selected: equals(app.fileShown, props.file) };
};

const mapDispatchToProps = dispatch => ({
  showFile: bindActionCreators(actions.showFile, dispatch),
  addFile: bindActionCreators(actions.addFile, dispatch),
  unAddFile: bindActionCreators(actions.unAddFile, dispatch),
  checkoutFile: bindActionCreators(actions.checkoutFile, dispatch),
  deleteFile: bindActionCreators(actions.deleteFile, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileBox);

