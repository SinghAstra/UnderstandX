export interface Field {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isRelation: boolean;
  relationTo?: string;
}

export interface Model {
  name: string;
  fields: Field[];
  position: {
    x: number;
    y: number;
  };
}

export const parseSchema = (): Model[] => {
  return [
    {
      name: "User",
      position: { x: 100, y: 100 },
      fields: [
        {
          name: "id",
          type: "String",
          isRequired: true,
          isList: false,
          isRelation: false,
        },
        {
          name: "email",
          type: "String",
          isRequired: true,
          isList: false,
          isRelation: false,
        },
        {
          name: "posts",
          type: "Post",
          isRequired: false,
          isList: true,
          isRelation: true,
          relationTo: "Post",
        },
      ],
    },
    {
      name: "Post",
      position: { x: 400, y: 100 },
      fields: [
        {
          name: "id",
          type: "String",
          isRequired: true,
          isList: false,
          isRelation: false,
        },
        {
          name: "title",
          type: "String",
          isRequired: true,
          isList: false,
          isRelation: false,
        },
        {
          name: "authorId",
          type: "String",
          isRequired: true,
          isList: false,
          isRelation: false,
        },
        {
          name: "author",
          type: "User",
          isRequired: true,
          isList: false,
          isRelation: true,
          relationTo: "User",
        },
      ],
    },
  ];
};
