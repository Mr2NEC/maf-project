/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  username: string;
};

/** The role of a user */
export type UserRole =
  | 'ADMIN'
  | 'HOST'
  | 'USER';

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { signIn: { accessToken: string, role: UserRole } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { signup: { id: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, username: string, email: string | null, role: UserRole } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const SignInDocument = new TypedDocumentString(`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    accessToken
    role
  }
}
    `) as unknown as TypedDocumentString<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = new TypedDocumentString(`
    mutation SignUp($input: SignUpInput!) {
  signup(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<SignUpMutation, SignUpMutationVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    id
    username
    email
    role
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;