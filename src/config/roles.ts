export interface Role {
  title: string;
  place?: string;
}

const roles: Role[] = [
  {
    title: "Web Dev",
    place: "TME",
  },
  {
    title: "Open Source Contributor",
  },
  {
    title: "Writer",
  }
]

export default roles;
