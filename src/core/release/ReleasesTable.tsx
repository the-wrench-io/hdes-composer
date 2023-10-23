import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

interface Release {
  id: string;
  body: {
    name: string;
    note?: string;
    created: string;
    data?: string;
  };
}

interface ReleasesTableProps {
  releases: Release[];
  tableRowComponent: React.FC<{
    release: Release;
  }>;
}

const latestRelease = {
  id: 'latest',
  body: {
    name: 'latest',
    note: 'The default branch with the latest changes that can be released',
    created: '',
    data: '',
  }
};


const ReleasesTable: React.FC<ReleasesTableProps> = ({ releases, tableRowComponent: TableRowComponent }) => {

  type sortOptions = 'name' | 'created';
  type sortDirections = 'asc' | 'desc';
  const [sort, setSort] = React.useState<sortOptions>('name');
  const [direction, setDirection] = React.useState<sortDirections>('desc');

  const sortByParam = (param: sortOptions, dir: sortDirections) => {
    switch (param) {
      case 'name':
        const sortedByName = [...releases].sort((a, b) => {
          const nameA = a.body.name;
          const nameB = b.body.name;
          return (dir === 'asc') ? (nameA.localeCompare(nameB)) : (nameB.localeCompare(nameA));
        });
        return [latestRelease, ...sortedByName];
      case 'created':
        const sortedByCreated = [...releases].sort((a, b) => {
          const dateA = new Date(a.body.created);
          const dateB = new Date(b.body.created);
          return (dir === 'asc') ? (dateA.getTime() - dateB.getTime()) : (dateB.getTime() - dateA.getTime());
        });
        return [latestRelease, ...sortedByCreated];
      default:
        return [];
    }
  };

  const sortByName = () => {
    setSort('name');
    setDirection((direction === 'asc') ? 'desc' : 'asc');
  }

  const sortByCreated = () => {
    setSort('created');
    setDirection((direction === 'asc') ? 'desc' : 'asc');
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ p: 1 }}>
            <TableCell sx={{ width: "20px" }}>
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>
              <TableSortLabel active={sort === 'name'} direction={direction} onClick={() => sortByName()}>
                <FormattedMessage id="releases.view.tag" />
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}>
              <TableSortLabel active={sort === 'created'} direction={direction} onClick={() => sortByCreated()}>
                <FormattedMessage id="releases.view.created" />
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold' }}><FormattedMessage id="releases.view.note" /></TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}><FormattedMessage id="releases.view.action" /></TableCell>
            <TableCell align="right" sx={{ width: "30px", fontWeight: 'bold' }}><FormattedMessage id="buttons.delete" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortByParam(sort, direction).map((release, index) => (<TableRowComponent key={index} release={release} />))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export type { Release, ReleasesTableProps };
export default ReleasesTable;
