import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemsTableRowId,
  CONFIRM_RECYCLE_BUTTON_ID,
  ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_ROW_CHECKBOX_CLASS,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';
import { TABLE_ITEM_RENDER_TIME } from '../../../support/constants';

const recycleItems = (itemIds) => {
  // check selected ids
  itemIds.forEach((id) => {
    cy.wait(TABLE_ITEM_RENDER_TIME);
    cy.get(
      `#${buildItemsTableRowId(id)} .${ITEMS_TABLE_ROW_CHECKBOX_CLASS}`,
    ).click();
  });

  cy.get(`#${ITEMS_TABLE_DELETE_SELECTED_ITEMS_ID}`).click();
  cy.get(`#${CONFIRM_RECYCLE_BUTTON_ID}`).click();
};

describe('Recycle Items in List', () => {
  it('recycle 2 items in Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // delete
    recycleItems([SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[1].id]);
    cy.wait(['@recycleItems', '@getOwnItems']);
  });

  it('recycle 2 items in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));

    if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
      cy.switchMode(ITEM_LAYOUT_MODES.LIST);
    }

    // delete
    recycleItems([SAMPLE_ITEMS.items[2].id, SAMPLE_ITEMS.items[3].id]);
    cy.wait('@recycleItems').then(() => {
      // check item is deleted, others are still displayed
      cy.wait('@getItem')
        .its('response.url')
        .should('contain', SAMPLE_ITEMS.items[0].id);
    });
  });

  describe('Error handling', () => {
    it('does not recycle items on error', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, recycleItemsError: true });
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      // delete
      recycleItems([SAMPLE_ITEMS.items[0].id, SAMPLE_ITEMS.items[1].id]);
      cy.wait('@recycleItems').then(() => {
        // check item is deleted, others are still displayed
        cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS.items[0].id)}`).should(
          'exist',
        );
        cy.get(`#${buildItemsTableRowId(SAMPLE_ITEMS.items[1].id)}`).should(
          'exist',
        );
      });
    });
  });
});