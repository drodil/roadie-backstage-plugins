/*
 * Copyright 2021 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';

import { Grid, Link } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { getStatusIconType, CommentIcon } from '../Icons';
import { makeStyles } from '@material-ui/core/styles';
import { useGithuRepositoryData } from '../useGithuRepositoryData';
import { Progress } from '@backstage/core-components';
import {
  GithubSearchPullRequestsDataItem,
  GithubRepositoryData,
} from '../../types';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    border: '1px solid grey',
    borderRadius: '6px',
  },
  pullRequestRow: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid grey',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  title: {
    fontWeight: Number(theme.typography.fontWeightBold),
  },
  link: {
    color: theme.palette.text.primary,
    '&:hover': {
      color: '#539bf5',
      fill: '#539bf5',
    },
    '&:first-child': {
      paddingRight: '4px',
    },
  },
  secondaryText: {
    color: theme.palette.text.secondary,
  },
  middleColumn: {
    paddingRight: '0.5rem',
    paddingLeft: '0.5rem',
  },
}));

type PullRequestListViewProps = {
  data: GithubSearchPullRequestsDataItem[];
  emptyStateText: string;
};
export const PullRequestsListView = (props: PullRequestListViewProps) => {
  const { data, emptyStateText } = props;
  const classes = useStyles();
  if (data.length < 1) {
    return (
      <Grid
        container
        className={classes.container}
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item md={12}>
          <Typography className={classes.secondaryText} variant="h6">
            {emptyStateText}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container className={classes.container} spacing={1}>
      {data.map(pr => (
        <PullRequestItem pr={pr} key={pr.id} />
      ))}
    </Grid>
  );
};

type PullRequestItemProps = {
  pr: GithubSearchPullRequestsDataItem;
};
const PullRequestItem = (props: PullRequestItemProps) => {
  const { pr } = props;
  const classes = useStyles();
  const {
    value: repoData,
    error,
    loading,
  }: {
    value?: GithubRepositoryData;
    error?: Error;
    loading: boolean;
  } = useGithuRepositoryData(pr.repositoryUrl);

  if (loading) return <Progress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Grid container item spacing={0} className={classes.pullRequestRow} xs={12}>
      <Grid item style={{ paddingLeft: '1rem', flexShrink: 0 }} xs="auto">
        {getStatusIconType(pr)}
      </Grid>
      <Grid item xs={10} className={classes.middleColumn}>
        <Typography variant="body1" noWrap className={classes.title}>
          {repoData ? (
            <Link
              className={classes.secondaryText + ' ' + classes.link}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              href={repoData.htmlUrl}
            >
              {repoData.fullName}
            </Link>
          ) : (
            <></>
          )}
          <Link
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            href={pr.pullRequest.htmlUrl}
          >
            {pr.title}
          </Link>
        </Typography>
        <Typography variant="caption" className={classes.secondaryText}>
          #{pr.number} opened by{' '}
          <Link
            className={classes.secondaryText + ' ' + classes.link}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            href={pr.user.htmlUrl}
          >
            {pr.user.login}
          </Link>
        </Typography>
      </Grid>

      <Grid
        item
        justifyContent="flex-end"
        container
        spacing={1}
        xs={1}
        style={{ paddingRight: '1rem', flexShrink: 0 }}
        className={classes.secondaryText}
      >
        <Grid item>
          <Link
            className={classes.secondaryText + ' ' + classes.link}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            href={pr.htmlUrl}
          >
            <CommentIcon /> {pr.comments}
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
