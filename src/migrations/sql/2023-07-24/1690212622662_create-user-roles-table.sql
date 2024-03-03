CREATE TABLE user_roles(
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title                           TEXT UNIQUE,

    created_at                      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at                      TIMESTAMP WITHOUT TIME ZONE

);

CREATE INDEX idx__user_roles__title ON user_roles(title);
