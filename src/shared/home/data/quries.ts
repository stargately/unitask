import gql from "graphql-tag";

export const getTasks = gql`
  query Tasks($state: TaskState, $setup: Setup) {
    tasks(state: $state, setup: $setup) {
      items {
        title
        url
        createdAt
        updatedAt
        closedAt
        repo {
          title
          url
        }
        milestone {
          title
          url
        }
        project {
          title
          url
        }
        assignees
      }
    }
  }
`;
