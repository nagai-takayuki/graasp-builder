import { ROOT_ID } from '../../../src/config/constants';
import {
  SHARE_ITEM_MODAL_PERMISSION_SELECT_ID,
  SHARE_ITEM_MODAL_SHARE_BUTTON_ID,
  buildPermissionOptionId,
  SHARE_ITEM_MODAL_EMAIL_INPUT_ID,
  buildTreeItemClass,
  TREE_MODAL_CONFIRM_BUTTON_ID,
  TREE_MODAL_TREE_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_IMAGE_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
  ITEM_FORM_LINK_INPUT_ID,
  ITEM_FORM_DOCUMENT_TEXT_SELECTOR,
  ITEM_FORM_APP_URL_ID,
} from '../../../src/config/selectors';
import {
  getAppExtra,
  getDocumentExtra,
  getEmbeddedLinkExtra,
} from '../../../src/utils/itemExtra';
import { getParentsIdsFromPath } from '../../../src/utils/item';
import { TREE_VIEW_PAUSE } from '../constants';

Cypress.Commands.add('fillShareModal', ({ member, permission }) => {
  // select permission
  cy.get(`#${SHARE_ITEM_MODAL_PERMISSION_SELECT_ID}`).click();
  cy.get(`#${buildPermissionOptionId(permission)}`).click();

  // input mail
  cy.get(`#${SHARE_ITEM_MODAL_EMAIL_INPUT_ID}`).type(member.email);

  cy.get(`#${SHARE_ITEM_MODAL_SHARE_BUTTON_ID}`).click();
});

Cypress.Commands.add('fillTreeModal', (toItemPath) => {
  const ids = getParentsIdsFromPath(toItemPath);

  cy.wait(TREE_VIEW_PAUSE);

  [ROOT_ID, ...ids].forEach((value, idx, array) => {
    cy.get(`#${TREE_MODAL_TREE_ID}`).then(($tree) => {
      // click on the element
      if (idx === array.length - 1) {
        cy.wrap($tree)
          .get(`.${buildTreeItemClass(value)} .MuiTreeItem-label input`)
          .first()
          .click();
      }
      // if can't find children click on parent (current value)
      if (
        idx !== array.length - 1 &&
        !$tree.find(`.${buildTreeItemClass(array[idx + 1])} .MuiTreeItem-label`)
          .length
      ) {
        cy.wrap($tree)
          .get(`.${buildTreeItemClass(value)} .MuiTreeItem-label`)
          .first()
          .click();
      }
    });
  });

  cy.get(`#${TREE_MODAL_CONFIRM_BUTTON_ID}`).click();
});

Cypress.Commands.add(
  'fillBaseItemModal',
  ({ name = '' }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_NAME_INPUT_ID}`).type(`{selectall}${name}`);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillSpaceModal',
  ({ name = '', extra = {} }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    cy.get(`#${ITEM_FORM_IMAGE_INPUT_ID}`).type(`{selectall}${extra.image}`);

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillLinkModal',
  ({ extra = {} }, { confirm = true } = {}) => {
    cy.get(`#${ITEM_FORM_LINK_INPUT_ID}`).type(
      `{selectall}${getEmbeddedLinkExtra(extra)?.url}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillDocumentModal',
  ({ name = '', extra = {} }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    cy.get(ITEM_FORM_DOCUMENT_TEXT_SELECTOR).type(
      `{selectall}${getDocumentExtra(extra)?.content}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);

Cypress.Commands.add(
  'fillAppModal',
  ({ name = '', extra = {} }, { confirm = true } = {}) => {
    cy.fillBaseItemModal({ name }, { confirm: false });

    cy.get(`#${ITEM_FORM_APP_URL_ID}`).type(
      `{selectall}${getAppExtra(extra)?.url}`,
    );

    if (confirm) {
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).click();
    }
  },
);
