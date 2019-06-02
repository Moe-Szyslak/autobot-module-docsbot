import { Command, CommandBase, CommandParser, Event } from '@autobot/common';
import { RichEmbed }                                  from 'discord.js';
import { Doc }                                        from '../_lib/Doc';
import { JSONUtil }                                   from '../_lib/JSONUtil';

const h2m = require('h2m');

/**
 *
 */
@Command
export class JavascriptCommand extends CommandBase {

    public static readonly PAGE_LENGTH: number = 1900;

    public static getEmbed(doc: Doc, page: number): RichEmbed {

        return new RichEmbed().setTitle(`devdocs: "${ doc.key }"`)
                              .setColor(3447003)
                              .addField('devdocs.io url', `https://devdocs.io/javascript/${ doc.key }`)
                              .setDescription(h2m(doc.doc).substr(JavascriptCommand.PAGE_LENGTH * page - 1, JavascriptCommand.PAGE_LENGTH));

    }

    public constructor() {

        //
        // Set this commands configuration.
        //
        super({

            event: Event.MESSAGE,
            name: '!js',
            group: 'docs',
            description: '!js <search term>'

        });

    }

    /**
     * Called when a command matches config.name.
     *
     * @param command Parsed out commamd
     *
     */
    public async run(command: CommandParser) {

        let currentPage: number = 1;

        const result = JSONUtil.getByName('strict_mode');

        if (result) {

            const message = await command.obj.channel.send(JavascriptCommand.getEmbed(result, 1));

            // @ts-ignore
            message.react('🗑');
            // @ts-ignore
            message.react('⏪');
            // @ts-ignore
            message.react('⏩');

            const filter = (reaction: any, user: any) => {

                // @ts-ignore
                // return [ '🗑' ].includes(reaction.emoji.name && user.id !== message.author.id);
                return [ '🗑', '⏪', '⏩' ].includes(reaction.emoji.name);

            };

            // @ts-ignore
            let collector = message.createReactionCollector(filter, { time: 15000 });

            // @ts-ignore
            collector.on('collect', (reaction, collector) => {

                console.log(reaction);

                if (!reaction.me) {

                    currentPage++;

                    // @ts-ignore
                    message.edit(JavascriptCommand.getEmbed(result, 1));

                    console.log(reaction);
                    console.log(reaction.emoji.name);

                    console.log('got a reaction');

                }

            });

            // @ts-ignore
            collector.on('end', collected => {

                console.log(`collected ${ collected.size } reactions`);

            });

            // @ts-ignore
            // message.awaitReactions(filter, { max: 1, time: 60000, errors: [ 'time' ] })
            //
            //        // @ts-ignore
            //        .then(collected => {
            //
            //            const reaction = collected.first();
            //
            //            console.log(123123, reaction);
            //
            //            console.log(reaction.me);
            //
            //            console.log(reaction.emoji.name);
            //
            //            if (!reaction.me) {
            //
            //                if (reaction.emoji.name === '⏩') {
            //
            //                    // @ts-ignore
            //                    message.reply('delete');
            //
            //                } else {
            //                    // @ts-ignore
            //                    message.reply('you reacted with a thumbs down.');
            //
            //                }
            //
            //            }
            //
            //
            //        })
            //        // @ts-ignore
            //        .catch(collected => {
            //
            //            console.log(`After a minute, only ${ collected.size } out of 4 reacted.`);
            //
            //            // @ts-ignore
            //            message.reply('you didn\'t react with neither a thumbs up, nor a thumbs down.');
            //
            //        });

        } else {

            command.obj.channel.send(new RichEmbed().setTitle('devdocs')
                                                    .setColor(3447003)
                                                    .setDescription(`Could not find any results for "${ command.arguments[ 0 ].name }`));

        }

        //
        // const embed = new RichEmbed().setTitle('Flip!')
        //                              .setColor(3447003);
        //
        // results.forEach(row => {
        //
        //     embed.addField(`❯ ${ row.total } points`, `<@${ row.to_userid }>`);
        //
        // });
        //
        // command.obj.channel.send(embed);

    }


}
