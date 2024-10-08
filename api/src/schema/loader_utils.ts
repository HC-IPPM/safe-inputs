import DataLoader from 'dataloader';
import _ from 'lodash';
import type { Model, HydratedDocument, FilterQuery } from 'mongoose';

export function create_dataloader_for_resources_by_foreign_key_attr<ModelDoc>(
  model: Model<ModelDoc>,
  fk_attr_path: string,
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, HydratedDocument<ModelDoc>[]>(
    async function (fkey_values) {
      const docs = await model.find({
        [fk_attr_path]: { $in: _.uniq(fkey_values) },
        ...options.constraints,
      } as FilterQuery<ModelDoc>);

      const keys_in_fk_attr = fk_attr_path.split('.');

      // we need to return matched rows from this loader ordered and grouped by the ids that were matched on
      // BUT the target foreign key attr may be a path to a subdoc's foreign key (so we need depth in our group by), and
      // any of those subdocs may have been arrays of subdocs which may have been matched on by more
      // than one of the ids we were looking for (so we need completeness in our final grouping)...
      // hence the following
      const get_docs_that_matched_on_fkey_value = (fkey_value: string) =>
        _.filter(docs, (root_doc) => {
          const fk_attr_leaf_value = _.reduce<string, any>(
            keys_in_fk_attr,
            (docs, key) => _.chain(docs).flatMap(key).filter().value(),
            [root_doc],
          );
          return _.some(
            fk_attr_leaf_value,
            (leaf_id) => leaf_id.toString() === fkey_value,
          );
        });

      const groups_in_order_of_requested_fkey_values = _.map(
        fkey_values,
        get_docs_that_matched_on_fkey_value,
      );

      return groups_in_order_of_requested_fkey_values;
    },
    { cache: options.cache || false },
  );
}

export function create_dataloader_for_resource_by_primary_key_attr<ModelDoc>(
  model: Model<ModelDoc>,
  primary_key_attr_path: string,
  options: {
    constraints?: FilterQuery<ModelDoc>;
    cache?: boolean;
  } = {
    constraints: {},
    cache: false,
  },
) {
  return new DataLoader<string, HydratedDocument<ModelDoc> | undefined>(
    async function (pkey_values) {
      const docs = await model.find({
        [primary_key_attr_path]: { $in: _.uniq(pkey_values) },
        ...options.constraints,
      } as FilterQuery<ModelDoc>);

      const docs_by_primary_key = _.keyBy(docs, (doc) =>
        _.toString(_.get(doc, primary_key_attr_path)),
      );

      const docs_in_order_of_requested_pkey_values = _.map(
        pkey_values,
        (key) => docs_by_primary_key[key],
      );

      return docs_in_order_of_requested_pkey_values;
    },
    { cache: options.cache || false },
  );
}
