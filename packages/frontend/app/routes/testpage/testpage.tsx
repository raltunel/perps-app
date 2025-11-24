import styles from './testpage.module.css';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import { useTranslation } from 'react-i18next';
import { useFuul } from '~/contexts/FuulContext';

export default function testpage() {
    const { t } = useTranslation();

    const { isAffiliateCodeFree } = useFuul();

    async function handleClick(code: string) {
        try {
            const codeIsFree = await isAffiliateCodeFree(code);
            console.log('codeIsFree: ', codeIsFree);
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization:
                        'Bearer 74c36d38cf3f44ae2e90991a7e2857a0b035a623791a096e06c54b0c7f81354d',
                },
            };

            fetch('https://api.fuul.xyz/api/v1/referral_codes/FF7uAz', options)
                .then((res) => res.json())
                .then((res) => console.log(res))
                .catch((err) => console.error(err));
        } catch (error) {
            console.log('Validation error:', error);
        }
    }

    return (
        <div className={styles.testpage}>
            <SimpleButton
                bg='dark2'
                hoverBg='accent1'
                onClick={() => handleClick('FF7uAz')}
            >
                {t('common.cancel')}2as
            </SimpleButton>
        </div>
    );
}
