import { HOME_PATH, buildItemPath } from '../../../../src/config/paths';
import {
  ITEM_FORM_CONFIRM_BUTTON_ID,
  buildEditButtonId,
} from '../../../../src/config/selectors';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { EDITED_FIELDS, SAMPLE_ITEMS } from '../../../fixtures/items';
import {
  EDIT_ITEM_PAUSE,
  TABLE_ITEM_RENDER_TIME,
} from '../../../support/constants';
import { editItem } from '../../../support/editUtils';

describe('Edit Folder', () => {
  describe('List', () => {
    describe('View Page', () => {
      // bug does not work in ci
      // it('edit caption', () => {
      //   const item = SAMPLE_ITEMS.items[0];
      //   const { id } = item;
      //   cy.setUpApi({ items: [item] });
      //   cy.visit(buildItemPath(id));

      //   cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      //   const caption = 'new caption';
      //   editCaptionFromViewPage({ id, caption });
      //   cy.wait(`@editItem`).then(({ request: { url: endpointUrl, body } }) => {
      //     expect(endpointUrl).to.contain(id);
      //     // caption content might be wrapped with html tags
      //     expect(body?.description).to.contain(caption);
      //   });
      // });
    });

    it('confirm with empty name', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      cy.visit(HOME_PATH);

      // wait for the render
      cy.wait(TABLE_ITEM_RENDER_TIME);

      // click edit button
      const itemId = SAMPLE_ITEMS.items[0].id;
      cy.get(`#${buildEditButtonId(itemId)}`).click();

      cy.fillFolderModal(
        {
          // put an empty name for the folder
          name: '',
        },
        { confirm: false },
      );

      // check that the button can not be clicked
      cy.get(`#${ITEM_FORM_CONFIRM_BUTTON_ID}`).should('be.disabled');
    });

    it('edit folder on Home', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      cy.visit(HOME_PATH);

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      const itemToEdit = SAMPLE_ITEMS.items[0];
      const newDescription = 'new description';
      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
          description: newDescription,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name, description },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          expect(description).to.contain(newDescription);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });

    it('edit folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      // go to children item
      cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));

      cy.switchMode(ITEM_LAYOUT_MODES.LIST);

      const itemToEdit = SAMPLE_ITEMS.items[2];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', SAMPLE_ITEMS.items[0].id);
        },
      );
    });
  });

  describe('Grid', () => {
    describe('View Page', () => {
      // bug: does not work in ci
      // it('edit caption', () => {
      //   const item = SAMPLE_ITEMS.items[0];
      //   const { id } = item;
      //   cy.setUpApi({ items: [item] });
      //   cy.visit(buildItemPath(id));

      //   cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      //   const caption = 'new caption';
      //   editCaptionFromViewPage({ id, caption });
      //   cy.wait(`@editItem`).then(({ request: { url: endpointUrl, body } }) => {
      //     expect(endpointUrl).to.contain(id);
      //     // caption content might be wrapped with html tags
      //     expect(body?.description).to.contain(caption);
      //   });
      // });
    });

    it('edit folder on Home', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = SAMPLE_ITEMS.items[0];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          cy.get('@getOwnItems');
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
        },
      );
    });

    it('edit folder in item', () => {
      cy.setUpApi(SAMPLE_ITEMS);
      // go to children item
      cy.visit(buildItemPath(SAMPLE_ITEMS.items[0].id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = SAMPLE_ITEMS.items[2];

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          cy.wait(EDIT_ITEM_PAUSE);
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.get('@getItem')
            .its('response.url')
            .should('contain', SAMPLE_ITEMS.items[0].id);
        },
      );
    });
  });
});