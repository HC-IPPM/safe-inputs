import DataLoader from 'dataloader';
import _ from 'lodash';
import type { Model, HydratedDocument, FilterQuery } from 'mongoose';

export function create_dataloader_for_resources_by_foreign_key_attr<ModelDoc>(
  model: Model<ModelDoc>,
  fk_attr: string,
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, HydratedDocument<ModelDoc>[]>(
    async function (fk_ids) {
      const documents = await model.find({
        [fk_attr]: { $in: _.uniq(fk_ids) },
        ...options.constraints,
      } as FilterQuery<ModelDoc>);

      const keys_in_fk_attr = fk_attr.split('.');

      // we need to return matched rows from this loader ordered and grouped by the ids that were matched on
      // BUT the target foreign key attr may be a path to a subdocument's foreign key (so we need depth in our group by), and
      // any of those subdocuments may have been arrays of subdocuments which may have been matched on by more
      // than one of the ids we were looking for (so we need completeness in our final grouping)...
      // hence the following
      const get_docs_that_matched_on_id = (id: string) =>
        _.filter(documents, (root_document) => {
          const leaf_ids = _.reduce<string, any>(
            keys_in_fk_attr,
            (documents, key) =>
              _.chain(documents).flatMap(key).filter().value(),
            [root_document],
          );
          return _.some(leaf_ids, (leaf_id) => leaf_id.toString() === id);
        });

      const groups_in_order_of_requested_keys = _.map(
        fk_ids,
        get_docs_that_matched_on_id,
      );

      return groups_in_order_of_requested_keys;
    },
    { cache: options.cache || false },
  );
}

export function create_dataloader_for_resource_by_primary_key_attr<ModelDoc>(
  model: Model<ModelDoc>,
  primary_key_attr: string,
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, HydratedDocument<ModelDoc> | undefined>(
    async function (keys) {
      const docs = await model.find({
        [primary_key_attr]: { $in: _.uniq(keys) },
        ...options.constraints,
      } as FilterQuery<ModelDoc>);

      const docs_by_primary_key = _.keyBy(docs, primary_key_attr);

      const docs_in_order_of_requested_keys = _.map(
        keys,
        (key) => docs_by_primary_key[key],
      );

      return docs_in_order_of_requested_keys;
    },
    { cache: options.cache || false },
  );
}
