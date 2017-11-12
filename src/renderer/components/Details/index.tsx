import * as React from 'react';
import { basename } from 'path';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import styled from 'styled-components';

import { IRepo } from '../../interfaces/IRepo';
import { renderLog } from '../../helpers/logger';
import { detailsHeaderHeight } from '../../utils/styles';
import actionsToConnect from '../../actions';
import StyledRepoDetails from './StyledRepoDetails';
import Diff from './Diff';
import Header from './Header';
import StatusesList from './StatusesList';

const Wrapper = styled.div`
  overflow: hidden;
  flex-grow: 1;
  height: calc(100vh - ${detailsHeaderHeight}px);

  display: flex;

  .react-resizable {
    overflow-y: auto;
  }
`;

const DiffWrapper = styled.div`
  overflow-y: auto;
  height: calc(100vh - ${detailsHeaderHeight}px);
`;

interface IRepoDetailsComponent {
  repo: IRepo;
  actions: any;
}

interface IRepoDetailsComponentState {
  width: number;
  height: number;
  sidebarWidth: number;
}

class RepoDetailsComponent extends React.PureComponent
<IRepoDetailsComponent, IRepoDetailsComponentState> {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0, sidebarWidth: 300 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  resized (event, {size}) {
    if (event) {
      this.setState({ sidebarWidth: size.width });
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight - detailsHeaderHeight });
  }

  render() {
    const { repo, actions } = this.props;
    const { width, height, sidebarWidth } = this.state;
    const diffWidth = width - sidebarWidth;

    if (!repo) { return null; }

    renderLog('REPO DETAILS', repo.name || basename(repo.dir));

    return (
      <StyledRepoDetails>
        <Header actions={actions} repo={repo}/>

        <Wrapper>
          <ResizableBox
            width={sidebarWidth}
            height={height}
            minConstraints={[200, height]}
            maxConstraints={[600, height]}
            axis='x'
            onResize={this.resized.bind(this)}
          >
            <StatusesList repo={repo} />
          </ResizableBox>

          <DiffWrapper style={{ width: diffWidth }}>
            {repo.progressing ?
              <span>Repo processing...</span> :
              <Diff dir={ repo.dir } wide={ diffWidth > 1000 } />
            }
          </DiffWrapper>
        </Wrapper>
      </StyledRepoDetails>
    );
  }
}

const mapStateToProps = (state) => {
  const repo = state.repos.filter(r => r.id === state.app.repoShown)[0];
  return { repo };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const RepoDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoDetailsComponent);

export default RepoDetails;
